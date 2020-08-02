const dk = require("./dk.js");
const https = require('https');

let buffer = []
let lesson_data = []
let counter = 0;
let working = false;
let try_counter = [];
let wg = false;

function onend(){
    let api = this.req.path.split('/')[3]
    let res = buffer.findIndex(b=>b.path == this.req.path)
    res = JSON.parse( buffer.splice(res,1)[0].buff )
    if (res.results) {res = res.results}
    
    if (api == 'lesson'){
        
        res = res.filter(ls=>ls.group.title.search(/[[ОМСЕ][.][0-9а-яА-Я\S]*/gm) != -1 )

        for(let i=0;i<res.length;i++){
            let id_group = lesson_data.push({
                id: res[i].group.id,
                time: res[i].datetime_start,
                title: res[i].group.title,
                start: res[i].start,
                participants:[],
                teacher:{},
                counter: 0,
            })

            id_group--;

            if(!res[i].teacher) {
                lesson_data[id_group].counter++
            }
            else{
                lesson_data[id_group].teacher.id = res[i].teacher.id
            }

            https.get("https://dragonapi.codabra.org/api/v1/group/" +
                        res[i].group.id + "/", options, response)
        }
    }
    else if(api == 'group'){
        let id_group = lesson_data.findIndex(less=>less.id == res.id)

        if (id_group == -1){
            id_group = lesson_data.findIndex(less=>less.id == this.req.path.split('/')[4])
            lesson_data.splice(id_group, 1)
            return
        }

        if (res.participants.length<=0){
            lesson_data.splice(id_group, 1)
            return
        }

        for (var i=0;i<res.participants.length;i++){
            lesson_data[id_group].participants.push({
                id: res.participants[i]
            })

            https.get("https://dragonapi.codabra.org/api/v1/users/" + 
                        res.participants[i] + "/", options, response)
        }

        if (!lesson_data[id_group].teacher.id){
            if(res.teacher) {
                lesson_data[id_group].teacher.id = res.teacher
                lesson_data[id_group].counter--;
            }
        }

        if (lesson_data[id_group].teacher.id){
            https.get("https://dragonapi.codabra.org/api/v1/users/" + 
                        lesson_data[id_group].teacher.id + "/", options, response)
        }

    }
    else if( api == 'users' ){
        let id_lesson;
        if(res.role==1){
            id_lesson = lesson_data.findIndex( less=> less.participants.findIndex(part=> part.id == res.id) != -1)
            
            let id_participants = lesson_data[id_lesson].participants.findIndex(part=> part.id == res.id)
            
            let lead = res.leads.find(lead => ("group" in lead)  ? (lead.group) : lead.group.id == lesson_data[id_lesson].id)
            
            delete lesson_data[id_lesson].participants[id_participants].id
            lesson_data[id_lesson].participants[id_participants].first_name = res.first_name
            lesson_data[id_lesson].participants[id_participants].last_name = res.last_name
            if (lead) lesson_data[id_lesson].participants[id_participants].lead = lead.amo_id
        }
        else if(res.role==2){
            id_lesson = lesson_data.findIndex(less=>less.teacher.id == res.id)

            delete lesson_data[id_lesson].teacher.id
            lesson_data[id_lesson].teacher.first_name = res.first_name
            lesson_data[id_lesson].teacher.last_name = res.last_name
        }
        else{
            dk.setTeacherRole(res.length);
            wg = false;
            return;
        }

        lesson_data[id_lesson].counter++;
        if (lesson_data[id_lesson].counter==lesson_data[id_lesson].participants.length+1){
            counter++
            if (counter == lesson_data.length){
                if (!working){
                    dk.checkRole(lesson_data)
                    wg = false;
                    return
                }
                working = false;
                dk.timeManagment(lesson_data)
                lesson_data = []
                counter = 0;
            }
        }
    }

}


function ondata(body){
    let buf = buffer.findIndex(b=>b.path == this.req.path )
    if (buf == -1){
        buffer.push({
            path: this.req.path,
            buff: body.toString()
        })
    }
    else{
        buffer[buf].buff += body.toString()
    }
}


function response(res){
    res.on('data', ondata )
    res.on('end', onend )
}

function groupOrUserInfo(message, status, key){
    if (wg || working) {

        if (key){
            let idx = try_counter.findIndex(tc=>tc.key == key)
            
            if (idx != -1){
                if (try_counter[idx].count++ == 6){
                    try_counter.splice(idx,1)
                    return
                }
            }
            else{
                try_counter.push({
                    key: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
                    count: 0
                })
            }
        }
        else{
            try_counter.push({
                key: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
                count: 0
            })
        }
        setTimeout(groupOrUserInfo,2000,message,status,key)
        return
    }

    if (key){
        let idx = try_counter.findIndex(tc=>tc.key == key)
        if (idx != -1)
            try_counter.splice(idx,1)
    }

    wg = true;

    if (status)
        for(var i=0;i<message.length;i++){
            https.get("https://dragonapi.codabra.org/api/v1/lesson/?default_filter=none\
                    &group__title__icontains="+message[i]+"&start__in=true", 
                    options, response)
        }
    else
        https.get("https://dragonapi.codabra.org/api/v1/users/?limit=999&\
                first_name="+ message[0] +"&last_name="+ message[1] +"&role=2", 
                    options, response)
}

function Info(){
    buffer = []
    lesson_data = []
    counter = 0;
    working = true;

    dk.clearTimmers()

    // get current date in dragon format
    let today = new Date();
    let datetime_today_range = today.getFullYear() + '-' 
                            + (today.getMonth()+1) + '-'
                            + (today.getDate()) + ',' 
                            + today.getFullYear() + '-' 
                            + (today.getMonth()+1) + '-' 
                            + (today.getDate()) ;

    // Получение занятий на сегодняшний день
    https.get("https://dragonapi.codabra.org/api/v1/lesson/?datetime_start__range=" +
                datetime_today_range+"&limit=999",
                options, response)

}

global.groupOrUserInfo = groupOrUserInfo
module.exports.Info = Info