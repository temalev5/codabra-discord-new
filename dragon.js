const dk = require("./dk.js");
const https = require('https');

let buffer = []
let lesson_data = []
let counter = 0;
let working = false;
let req_query = [];
let wg = false;
let today;

let gandu = [];

function _queryInfo(req){

    let res = buffer.findIndex(b=>b.path == req.path)


    res = JSON.parse( buffer.splice(res,1)[0].buff )
    if (res.results) {res = res.results}

    return res
}


let onendgroup = function(pres_less){
    return function(){
        let titles = [];
        let res = _queryInfo(this.req)
        
        // const fs = require('fs')
        // let json2xls = require('json2xls');

        // var jsonArr = [];


        // let xls = json2xls(jsonArr);

        // fs.writeFileSync('data.xlsx', xls, 'binary');

        for (var i=0;i<res.length;i++){
            if (!pres_less){
                
                // if ( res[i].title.toLowerCase().indexOf("test") > -1 )//|| 
                //     //  res[i].title.toLowerCase().indexOf("пз") > -1 || 
                //     //  res[i].title.toLowerCase().indexOf("из") > -1 )
                //      {
                //          continue
                //      }
                // jsonArr.push({
                //     title: res[i].title,
                //     start: res[i].start_of_lessons,
                //     end: res[i].end_of_lessons,
                //     participants_count: res[i].participants_count
                // })

                if (!res[i].presentation_lesson){
                    titles.push(res[i].title)
                }
            }
            else{
                titles.push(res[i].title)
            }
        }

        // if (!pres_less){
        //     let xls = json2xls(jsonArr);
        //     fs.writeFileSync('data.xlsx', xls, 'binary');
        // }
        
        // for (var i=0;i<res.length;i++){
        //     titles.push(res[i].title)
        // }

        
        if (titles){
            dk.deleteGroups(titles)
        }
    }
}

function onend(){
    let api = this.req.path.split('/')[3]
    let res = _queryInfo(this.req)
    
    if (api == 'lesson'){

        res = res.filter(ls=>ls.group.title.search(/[О][.][0-9а-яА-Я]*[.]?[0-9а-яА-Я]*[-][0-9]+[\s0-9-()]*/gm) != -1 )

        if (res.length == 0){
            working = false;
            wg = false;

            if (req_query.length != 0){
                groupOrUserInfo(req_query[0].message, req_query[0].status)
                req_query.splice(0, 1)
            }

            return
        }

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

            if(!res[i].teacher.id) {
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
            if (lesson_data.length == 0){
                working = false;
                wg = false;
                if (req_query.length != 0){
                    groupOrUserInfo(req_query[0].message, req_query[0].status)
                    req_query.splice(0, 1)
                }
            }
            return
        }

        if (res.participants.length<=0){
            lesson_data.splice(id_group, 1)
            return
        }

        if (res.presentation_lesson){
            let end = new Date(res.presentation_lesson)
            if ( end.getFullYear() == today.getFullYear() && 
                 end.getMonth() == today.getMonth() && 
                 end.getDate() == today.getDate()){
                    lesson_data[id_group].end = true
            }
            else {
                lesson_data[id_group].end = false
            }
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
            if (req_query.length != 0){
                groupOrUserInfo(req_query[0].message, req_query[0].status)
                req_query.splice(0, 1)
            }
            return;
        }

        lesson_data[id_lesson].counter++;
        if (lesson_data[id_lesson].counter==lesson_data[id_lesson].participants.length+1){
            counter++
            if (counter == lesson_data.length){
                if (!working){
                    dk.checkRole(lesson_data)
                    wg = false;
                    lesson_data = []
                    counter = 0;
                    if (req_query.length != 0){
                        groupOrUserInfo(req_query[0].message, req_query[0].status)
                        req_query.splice(0, 1)
                    }
                    return
                }
                working = false;
                dk.timeManagment(lesson_data)
                lesson_data = []
                counter = 0;
                if (req_query.length != 0){
                    groupOrUserInfo(req_query[0].message, req_query[0].status)
                    req_query.splice(0, 1)
                }
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

let userinfo = function(key){
    return function(){
        let res = _queryInfo(this.req)
        let id = gandu.findIndex(g=>g.key == key)
        
        gandu[id].participants.push({
            ft_name:res.first_name,
            lt_name:res.last_name
        })

        if ( ++gandu[id].count == gandu[id].len){
            dk.checkRoleA( gandu.splice( id , 1 )[0]  )
        }
    }
}

let onendGandU = function(key, group){
    return function(){
        let res = _queryInfo(this.req)
        if (res.length == 0) { dk.checkRoleA({key:key, error_code: 1}); return;}
        res = res[0];
        
        if ( group.toLowerCase().replace(/\s?\((.*)\)/gm,"") != 
                res.title.toLowerCase().replace(/\s?\((.*)\)/gm,"") )
                return
        
        if (res.participants.length == 0){
            dk.checkRoleA({key:key,participants:[],group:res.title})
            return
        }

        gandu.push({
            key:key,
            group:res.title,
            participants:[],
            count:0,
            len:res.participants.length,
        })
        
        for (var i=0;i<res.participants.length;i++){
            https.get("https://dragonapi.codabra.org/api/v1/users/" +
                    res.participants[i] + "/", options, (res)=>{
                    res.on('data', ondata);
                    res.on('end', userinfo(key) );
                })
        }

        console.log(key)
    }
}

function groupAndUserInfo( key, group ){

    https.get("https://dragonapi.codabra.org/api/v1/group/?title="
                + group.toUpperCase(), options, (res)=>{
                    res.on('data', ondata);
                    res.on('end', onendGandU(key, group ) );
                })
    
    let a = 10;
}

function groupOrUserInfo(message, status){
    
    if (wg || working ) {

        req_query.push({
            id:Math.round(Math.random()*1000),
            message:message,
            status:status
        })

        return
    }

    lesson_data = []
    counter = 0;
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
    today = new Date();
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

    let one_mth_ago = new Date(today);
    one_mth_ago.setDate(today.getDate()-15)
    
    datetime_today_range = one_mth_ago.getFullYear() + '-' 
                             + (one_mth_ago.getMonth()+1) + '-'
                             + (one_mth_ago.getDate()) + ',' 
                             + one_mth_ago.getFullYear() + '-' 
                             + (one_mth_ago.getMonth()+1) + '-' 
                             + (one_mth_ago.getDate()) ;
    
    // Удаление старых групп

    https.get("https://dragonapi.codabra.org/api/v1/group/?presentation_lesson=" +
                datetime_today_range+"&limit=999",
                options, (res)=>{    res.on('data', ondata ); res.on('end', onendgroup(true) ) })

    https.get("https://dragonapi.codabra.org/api/v1/group/?date=" +
                datetime_today_range+"&city__id__in=1&limit=999",
                options, (res)=>{    res.on('data', ondata ); res.on('end', onendgroup(false) ) })

    let ten_days_ago = new Date(today);
    ten_days_ago.setDate(today.getDate()-6)
                
    datetime_today_range = ten_days_ago.getFullYear() + '-' 
                             + (ten_days_ago.getMonth()+1) + '-'
                             + (ten_days_ago.getDate()) + ',' 
                             + ten_days_ago.getFullYear() + '-' 
                             + (ten_days_ago.getMonth()+1) + '-' 
                             + (ten_days_ago.getDate()) ;
                
    // Удаление старых групп
            
    https.get("https://dragonapi.codabra.org/api/v1/group/?presentation_lesson=" +
                datetime_today_range+"&lecture_hall__id__in=177&limit=999",
                options, (res)=>{    res.on('data', ondata ); res.on('end', onendgroup(true) ) })

    https.get("https://dragonapi.codabra.org/api/v1/group/?date=" +
                datetime_today_range+"&lecture_hall__id__in=177&limit=999",
                options, (res)=>{    res.on('data', ondata ); res.on('end', onendgroup(false) ) })
}

global.groupAndUserInfo = groupAndUserInfo
global.groupOrUserInfo = groupOrUserInfo
module.exports.Info = Info