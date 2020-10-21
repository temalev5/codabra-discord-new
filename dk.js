const out = require("./out.js");
let abb_name = [
    ['Алик','Альберт','Олег'],
    ['Аля','Алевтина','Алина','Алиса','Алла','Альбина'],
    ['Аня','Анна'],
    ['Артём','Артемий','Тёма'],
    ['Ася','Аксинья','Таисия'],

    ['Боря','Борис','Борислав'],

    ['Вадя','Вадим','Владимир','Владислав','Владлен','Влад','Вова','Володя','Слава','Вячеслав','Ярослав','Святослав','Вадик'],
    ['Валера','Валерий','Валерия','Лера'],
    ['Валя','Валентин','Валентина'],
    ['Ваня','Иван'],
    ['Вася','Василий','Василиса'],
    ['Варя','Варвара'],
    ['Вера','Венера','Вероника','Вероника','Вика','Виктория','Ника'],
    ['Витя','Виктор'],
    ['Веня','Вениамин'],
    ['Виталий','Виталик','Виталя'],

    ['Галя','Галина'],
    ['Гарик','Георгий','Игорь'],
    ['Гена','Геннадий'],
    ['Гриша','Григорий'],
    ['Геля','Ангелина'],

    ['Даня','Даниил','Данил'],
    ['Даша','Дарья'],
    ['Дима','Дмитрий'],
    ['Дина','Диана'],
    ['Дуня','Евдокия'],

    ['Женя','Евгений','Евгения'],

    ['Ира','Ирина'],

    ['Кеша','Иннокентий'],
    ['Коля','Николай'],
    ['Костя','Константин'],
    ['Ксюша','Ксения'],
    ['Катя','Екатерина'],

    ['Лёня','Леонид'],
    ['Леся','Олеся'],
    ['Лёша','Алексей'],
    ['Лиза','Елизавета'],
    ['Люся','Людмила','Мила'],
    ['Лев','Лёва'],
    ['Лена','Елена'],
    ['Люба','Любовь'],

    ['Мариша','Марина','Мария','Маша','Маруся'],
    ['Миша','Михаил'],
    ['Макс','Максим'],

    ['Нина','Антонина'],
    ['Настя','Анастасия'],
    ['Надя','Надежда'],
    ['Наташа','Наталья'],

    ['Оля','Ольга'],

    ['Паша','Павел'],
    ['Петя','Пётр'],
    ['Поля','Полина','Пелагея'],

    ['Рита','Маргарита'],
    ['Рома','Роман'],

    ['Саня','Саша','Александр','Александра'],
    ['Света','Светлана'],
    ['Сева','Всеволод'],
    ['Сёма','Семён'],
    ['Сеня','Арсений'],
    ['Серёжа','Сергей'],
    ['Соня','Софья','София'],
    ['Стас','Станислав'],
    ['Стёпа','Степан'],

    ['Таня','Татьяна'],
    ['Толя','Анатолий'],
    ['Тима','Тимофей '],

    ['Федя','Фёдор'],

    ['Эля','Эвелина'],

    ['Юра','Юрий']
]

let timmers = []

let message_buffer=[];

let g_data=[];


function checkRoleA(gd){

    let support_channel = guild.channels.cache.find(c=>c.name=="посещаемость")

    let id = message_buffer.findIndex(mb=>mb.key == gd.key)
    let mb = message_buffer.splice(id, 1)[0]
    
    if (gd.error_code){
        mb.msg.channel.send('',{
            embed: {
                color: 16711680,
                description: "Привет <@"+mb.msg.member.id+">\n\
                              Не удалось найти **группу `` "+ mb.group.toUpperCase() +" ``**\n\
                              Попробуй еще раз, напиши **Имя Фамилию Группу**\n\
                              **Пример:** *Юлия Беляева О.У1ВВА1-19*\n\
                              **Если не знаешь какая у тебя группа, посмотри сюда:** https://www.notion.so/2dc2dc0f96ee44ba924d441f98c1ce3f\n\
                              На всякий случай я переслал твое сообщение в Поддержку"
                    }
                }).then((m)=>m.delete({ timeout: 120000 }))

        support_channel.send('',{
            embed: {
                color: 16711680,
                description: "Не удалось найти **группу `` "+ mb.group.toUpperCase() +" ``**\n\
                              **<@" + mb.msg.member.id + "> пишет:**\n" + mb.msg.content
            }
        })
        return
    }

    let group;
    let f_name = mb.f_name.slice()
    mb.f_name = _findAbbName(mb.f_name)
    
    here: for (var j = 0; j < gd.participants.length;j++){
        let fn_mark = false;
        let ln_mark = false;
            
        for (var x=0;x<mb.f_name.length;x++){
            if ( mb.f_name[x].toLowerCase().replace(/ё/g,'е') == 
                    gd.participants[j].ft_name.toLowerCase().replace(/ё/g,'е') ){
                    fn_mark = true;
                }
            else if( mb.f_name[x].toLowerCase().replace(/ё/g,'е') == 
                        gd.participants[j].lt_name.toLowerCase().replace(/ё/g,'е') ) {
                        ln_mark = true;
                    }
    
            if (fn_mark && ln_mark) 
            {   
                group = gd.group.toLowerCase().replace(/\s?\((.*)\)/gm,"")
                break here;
            }
        }
    }

    if (!group){
        mb.msg.channel.send('',{
            embed: {
                color: 16711680,
                description: "Привет <@"+mb.msg.member.id+">\n\
                              Не смог найти такого ученика в **группе `` "+ gd.group.toUpperCase() +" ``**\n\
                              Попробуй еще раз, напиши **Имя Фамилию Группу**\n\
                              **Пример:** *Юлия Беляева О.У1ВВА1-19*\n\
                              **Если не знаешь какая у тебя группа, посмотри сюда:** https://www.notion.so/2dc2dc0f96ee44ba924d441f98c1ce3f\n\
                              На всякий случай я переслал твое сообщение в Поддержку"
                    }
                }).then((m)=>m.delete({ timeout: 120000 }))
        let ms = '';
        ms += "**Список учеников группы** `` "+ gd.group.toUpperCase() +" ``\n"
        for (var i=0;i<gd.participants.length;i++){
            ms += gd.participants[i].ft_name + " " + gd.participants[i].lt_name + "\n"
        }
        support_channel.send('',{
            embed: {
                color: 16711680,
                description: "Не смог найти такого ученика в **группе `` "+ gd.group.toUpperCase() +" ``**\n\
                              **<@" + mb.msg.member.id + "> пишет:**\n" + mb.msg.content + "\n" + ms
            }
        })

        return;
    }
    else{
        mb.msg.member.edit({
            nick: f_name[0][0].toUpperCase() + f_name[0].substring(1) + ' ' + 
                  f_name[1][0].toUpperCase() + f_name[1].substring(1) + ' ' +
                  group.toUpperCase()
       })
       togleRole(mb.msg, group, true)
    }
}

function _getGroupInfo(group){

    let channels = {
        "ИЗ":{
            color:0,
            category:708650112670498909,
        },
        "РБ":{
            color: 2864101,
            category:708649828040572969,
        },
        "М":{
            color:8043081,
            category:708649648629350431,
        },
        "К":{
            color:8043081,
            category:756822329174130698,
        },
        "КБ":{
            color:333675,
            category:708649821975740416,
        },
        "C":{
            color:16232999,
            category:694888469364736040,
        },
        "Ю":{
            color:8684684,
            category:708649086919901214,
        },
        "3Д":{
            color:15496196,
            category:708649482396631050,
        },
        "Н":{
            color:12757146,
            category:705887039320752201, 
        },
        "П":{
            color:16768064,
            category:688049880156995590, 
        },
        "В":{
            color:2588588,
            category:708649095987986442, 
        },
        "Р":{
            color:14965844,
            category:687986411273715742, 
        }
    }

    for (var key in channels){
        if ( group.toUpperCase().indexOf( key ) != -1 )
            return channels[key];
    }
    return 0; 
}

function createGroup(group, msg, group, user){

    gInfo = _getGroupInfo(group)

    guild.roles.create({
        data:{
            name: "Ученик " + group.toUpperCase(),
            color: gInfo.color,
            hoist: true,
            permissions:[],
            mentionable: false
        }
    }).then( (role)=>{
        guild.channels.create(group.toUpperCase(),{
            type:"voice",
            nsfw:false,
            parent: guild.channels.cache.find(ch => ch.id == gInfo.category),
            permissionOverwrites: [{
                id: role.id,
                allow:["VIEW_CHANNEL"],
            }],
    
        });

        guild.channels.create(group.toLowerCase().replace(".","").replace(/\s?\((.*)\)/gm,""), {
            type:"text",
            nsfw:false,
            parent: guild.channels.cache.find(ch => ch.id == gInfo.category),
            permissionOverwrites: [{
                id: role.id,
                allow:["VIEW_CHANNEL"],
            }],
    
        })

        msg.react("🥇")
        _setRole(role, msg, group, user)
    })
}

function deleteGroups(groups){
    for (var i=0; i<groups.length;i++){
        let channel = guild.channels.cache.find( ch => ch.name == groups[i].toLowerCase().replace(".","").replace(/\s?\((.*)\)/gm,"") )
        if (channel)
            channel.delete()
                   .then( ()=> { send(admin, "Удален текстовый канал " + channel.name) } )
                   .catch( (err)=> { send(admin, "Не удалось удалить текстовый канал " + channel.name + " "+ err) });
                   
        channel = guild.channels.cache.find( ch => ch.name == groups[i].toUpperCase().replace(/\s?\((.*)\)/gm,"") )
        if (channel)
            channel.delete()
                    .then( ()=> { send(admin, "Удален голосовой канал " + channel.name) } )
                    .catch( (err)=> { send(admin, "Не удалось удалить голосовой канал " + channel.name) });
        let role = guild.roles.cache.find( r => r.name == "Ученик " +  groups[i].toUpperCase().replace(/\s?\((.*)\)/gm,"") )
        if (role)
            role.delete()
                .then( ()=> { send(admin, "Удалена роль " + channel.name) })
                .catch( (err)=> { send(admin, "Не удалось удалить роль " + channel.name) });
    }
}

function clearTimmers(){
    for (var i=0;i<timmers.length;i++){
        clearTimeout(timmers[i])
    }
    timmers = []
}

function _groupByTime(lesson_data){
    let time_slots = []
    for (var i=0;i<lesson_data.length;i++){

        let idx = time_slots.findIndex(ts=> ts.time == lesson_data[i].time)
        if (idx==-1){
            idx = time_slots.push({
                time: lesson_data[i].time,
                teachers:[]
            })
            idx--;
        }

        time_slots[idx].teachers.push({
            group: lesson_data[i].title,
            start: lesson_data[i].start,
            end: lesson_data[i].end,
            first_name: lesson_data[i].teacher.first_name,
            last_name:lesson_data[i].teacher.last_name,
        })

    }

    return time_slots
}

function setTimmer(minutes, data, func){
    for(var i=0;i<data.length;i++){
        let current_time = new Date();
        let less_date = new Date (data[i].time);
        less_date.setMinutes( less_date.getMinutes() + minutes );
        if (( less_date - current_time) <= 0 ){
            continue
        }
        timmers.push(setTimeout(func, less_date - current_time, data[i]));
    }
}

function timeManagment(lesson_data){
    
    g_data = null
    g_data = lesson_data

    setTimmer(+10, lesson_data, pInChannel)

    setTimmer(-35, _groupByTime(lesson_data.filter( ld => ld.title.toUpperCase().indexOf("ИЗ") == -1 )) , tInChannel )

    setTimmer(-10, _groupByTime(lesson_data.filter( ld => ld.title.toUpperCase().indexOf("ИЗ") != -1 )), tInChannel )
}

function tInChannel(time_slot){

    for(var i=0;i<time_slot.teachers.length;i++){
        let channel = guild.channels.cache.find(channel => 
            channel.type =='voice' && 
            time_slot.teachers[i].group.toLowerCase().replace(/\s?\((.*)\)/gm,"") == 
            channel.name.toLowerCase().replace(/\s?\((.*)\)/gm,"") )

        let member;

        if (channel){
            member = inChannel(time_slot.teachers[i].first_name,
                time_slot.teachers[i].last_name, channel)
            
            time_slot.teachers[i].in_channel = Boolean(member)
        }

        if (!member){
            member = inChannel(time_slot.teachers[i].first_name,
                time_slot.teachers[i].last_name)
        }

        if (!member) {send(admin, 'Не найден преподаватель *' + 
                                    time_slot.teachers[i].title + '*'); continue}

        time_slot.teachers[i].status = mStatus(member)

    }

    out.messageAboutMissTeachers(time_slot)

}

function pInChannel(lesson){

    let in_channel_counter = 0;
    let channel = guild.channels.cache.find(channel => 
                    channel.type =='voice' && 
                    lesson.title.toLowerCase().replace(/\s?\((.*)\)/gm,"") == 
                    channel.name.toLowerCase().replace(/\s?\((.*)\)/gm,"") )
    
    if (!channel) return

    for(var i=0;i<lesson.participants.length;i++){
        let member = inChannel(lesson.participants[i].first_name, 
                               lesson.participants[i].last_name, channel)
        if (member){
            lesson.participants[i].in_channel = true
            in_channel_counter++
            if (in_channel_counter == lesson.participants.length){
                send(admin, ':ribbon: *' + lesson.title.toUpperCase() + '*\n *Все в канале*')
                send(miss_participants, ':ribbon: *' + lesson.title.toUpperCase() + '*\n *Все в канале*')
                return
            }
        } 
    }
    out.messageAboutMissParticipants(lesson)
}

function mStatus(member){
    let clientStatus;
    let version = member.presence.clientStatus ? Object.keys(member.presence.clientStatus)[0] : null;
    if (version){
        clientStatus = {
            version: (version == 'desktop') ? 'laptop': version,
            status: member.presence.clientStatus[version]
        }
    }
    else{
        clientStatus = {
            status: 'offline'
        }
    }
    return clientStatus
}

function setTeacherRole(status){
    let mb = message_buffer.splice(0,1)[0];

    if (!mb) return

    if (status){
        let member = guild.members.cache.find(m=>m.id == mb.msg.author.id)
        let role = guild.roles.cache.find(role=>role.name == "Преподаватель" )
        member.edit({
            nick: mb.f_name.join(' ')
        })
        member.roles.add(role).then(
            () => {mb.msg.react("👍")}
        )
        send(admin,"Новый препод: "+ mb.f_name.join(' '))
    }
    else{
        mb.msg.reply('',{
            embed: {
                color: 16711680,
                description: "Привет <@"+mb.msg.author.id+">\n\
                              Не удалось найти такого преподавателя\n\
                              Попробуй еще раз, напиши **Имя Фамилию Ключ**\n\
                              **Пример:** *Оксана Родзянко 4-:#+fq@.)sPz{t*\n\
                              Проверь свое Имя Фамилию в личном кабинете: https://codabra.org/profile/account/"
                    }
                })
        send(admin,"Не удалось найти такого преподавателя "+ mb.f_name.join(' '))
    }
}

function _findAbbName(nickname){
    let len = nickname.length

    for(var j=0;j<len;j++){
        let c = abb_name.find(a=> a.findIndex(b=>
                                 b.toLowerCase().replace(/ё/g,'е') == 
                                 nickname[j].toLowerCase().replace(/ё/g,'е')) != -1)
        if(c){
            nickname.splice(j,1);
            nickname = nickname.concat(c)
            len--;
            j--;
        }
    }
    return nickname
}

function inChannel(first_name='', last_name='', channel){
    let members;

    if (channel){
        members = channel.members.array();
    }
    else{
        members = guild.members.cache.array();
    }

    for(var i=0;i<members.length;i++){
        let fn_mark = false;
        let ln_mark = false;
        let nickname;

        if (!members[i].nickname)
            nickname = members[i].user.username
        else
            nickname = members[i].nickname

        nickname = nickname.split(' ');
        
        nickname = _findAbbName(nickname)

        for (var j=0;j<nickname.length;j++){
            if ( nickname[j].toLowerCase().replace(/ё/g,'е') == 
                first_name.toLowerCase().replace(/ё/g,'е') ){
                    fn_mark = true;
                }
            else if( nickname[j].toLowerCase().replace(/ё/g,'е') == 
                last_name.toLowerCase().replace(/ё/g,'е') ) {
                    ln_mark = true;
                }

            if (fn_mark && ln_mark) 
            {   
                if (channel){
                    return members[i];
                }
                else{
                    let role = members[i].roles.cache.find(rl=>rl.name == "Преподаватель" || 
                                                               rl.name == "AdMinistrator" ||
                                                               rl.name =='Administrator')
                    if (role) return members[i];
                } 
            }
        }
    }
}

function checkRole(group_data){
    let mb = message_buffer.splice(0,1)[0];
    let groups = [];
    let f_name = mb.f_name.slice()
    mb.f_name = _findAbbName(mb.f_name)
    
    here: for (var i=0;i<mb.groups.length;i++){
        let gd = group_data.find(gd=> gd.title.toLowerCase().replace(/\s?\((.*)\)/gm,"") == 
                             mb.groups[i].toLowerCase().replace(/\s?\((.*)\)/gm,"") )
        
        if (!gd) {
            groups.push({group:mb.groups[i].toLowerCase().replace(/\s?\((.*)\)/gm,""),
                        result: 2})
            continue
        }

        for (var j = 0; j < gd.participants.length;j++){
            let fn_mark = false;
            let ln_mark = false;
            
            for (var x=0;x<mb.f_name.length;x++){
                if ( mb.f_name[x].toLowerCase().replace(/ё/g,'е') == 
                     gd.participants[j].first_name.toLowerCase().replace(/ё/g,'е') ){
                        fn_mark = true;
                    }
                else if( mb.f_name[x].toLowerCase().replace(/ё/g,'е') == 
                         gd.participants[j].last_name.toLowerCase().replace(/ё/g,'е') ) {
                        ln_mark = true;
                    }
    
                if (fn_mark && ln_mark) 
                {   
                    groups.push({group:gd.title.toLowerCase().replace(/\s?\((.*)\)/gm,""),
                                    result:0})
                    continue here;
                }
            }
        }

        groups.push({group:gd.title.toLowerCase().replace(/\s?\((.*)\)/gm,""),
                     result: 1})

    }

    let support_channel = guild.channels.cache.find(c=>c.name=="посещаемость")
    for(var i = 0;i<3;i++){
        let gr = groups.filter(gr=>gr.result == i)

        if (gr != 0){
            switch (i){
                case 0:
                    mb.msg.member.edit({
                         nick: f_name[0][0].toUpperCase() + f_name[0].substring(1) + ' ' + 
                               f_name[1][0].toUpperCase() + f_name[1].substring(1) + ' ' +
                               gr.map(g=>g.group)[0].toUpperCase()
                    })
                    togleRole(mb.msg, gr.map(g=>g.group), mb.groups.length)
                    break;
                case 1:
                    mb.msg.channel.send('',{
                        embed: {
                            color: 16711680,
                            description: "Привет <@"+mb.msg.member.id+">\n\
                                          Не смог найти такого ученика в **группе(ах) `` "+ gr.map(g=>g.group).join(' ').toUpperCase() +" ``**\n\
                                          Попробуй еще раз, напиши **Имя Фамилию Группу**\n\
                                          **Пример:** *Юлия Беляева О.У1ВВА1-19*\n\
                                          **Если не знаешь какая у тебя группа, посмотри сюда:** https://www.notion.so/2dc2dc0f96ee44ba924d441f98c1ce3f\n\
                                          На всякий случай я переслал твое сообщение в Поддержку"
                                }
                            }).then((m)=>m.delete({ timeout: 120000 }))
                    let ms = '';
                    gr = gr.map(g=>g.group)
                    for (var j=0;j<gr.length;j++){
                        let g = group_data.find(gd=> gd.title.toLowerCase().replace(/\s?\((.*)\)/gm,"") == 
                                 gr[j].toLowerCase().replace(/\s?\((.*)\)/gm,"") )
                        ms += "Не смог найти такого ученика в **группе(ах) `` "+ gr.map(g=>g.group).join(' ').toUpperCase() +" ``**\n\
                               **Список учеников группы** `` "+ g.title +" ``\n"
                        for (var x=0;x<g.participants.length;x++){
                            ms += g.participants[x].first_name + " " + g.participants[x].last_name + "\n"
                        }
                    }
                    support_channel.send('',{
                        embed: {
                            color: 16711680,
                            description: "**<@" + mb.msg.member.id + "> пишет:**\n" + mb.msg.content + "\n" + ms
                        }
                    })

                    return;
                case 2:
                    mb.msg.channel.send('',{
                        embed: {
                            color: 16711680,
                            description: "Привет <@"+mb.msg.member.id+">\n\
                                          Не правильно указана **группа(ы) `` "+ gr.map(g=>g.group).join(' ').toUpperCase() +" ``**\n\
                                          Попробуй еще раз, напиши **Имя Фамилию Группу**\n\
                                          **Пример:** *Юлия Беляева О.У1ВВА1-19*\n\
                                          **Если не знаешь какая у тебя группа, посмотри сюда:** https://www.notion.so/2dc2dc0f96ee44ba924d441f98c1ce3f\n\
                                          На всякий случай я переслал твое сообщение в Поддержку"
                                }
                            }).then((m)=>m.delete({ timeout: 120000 }))

                    support_channel.send('',{
                        embed: {
                            color: 16711680,
                            description: "Не правильно указана **группа(ы) `` "+ gr.map(g=>g.group).join(' ').toUpperCase() +" ``**\n\
                                          **<@" + mb.msg.member.id + "> пишет:**\n" + mb.msg.content
                        }
                    })

                    break;
            }
        }
    }
}

function _setRole(role, msg, group, user){
    if (msg.member.roles.cache.find(role => role.name == 'Ученик ' + group.toUpperCase() ) && !user){
        msg.member.roles.remove(role)
                        .then( () => {msg.react('👍')})
    }
    else{
        msg.member.roles.add(role)
                        .then( () => {msg.react('👍')})
    }
}

function togleRole(msg, group, user){

    let role = msg.guild.roles.cache.find(role=>role.name == 'Ученик ' + group.toUpperCase() )
    if (!role && user){
        createGroup(group, msg, group, user);
        return
    }

    _setRole(role, msg, group, user)

}

function nameCompare(nickname, first_name='', last_name=''){
    
    let fn_mark = false
    let ln_mark = false
    
    nickname = nickname.split(" ")
    nickname = _findAbbName(nickname)
    
    for (let j=0;j<nickname.length;j++){
        if ( nickname[j].toLowerCase().replace(/ё/g,'е') == 
            first_name.toLowerCase().replace(/ё/g,'е') ){
                fn_mark = true;
            }
        else if( nickname[j].toLowerCase().replace(/ё/g,'е') == 
            last_name.toLowerCase().replace(/ё/g,'е') ) {
                ln_mark = true;
            }
    }
    if (fn_mark && ln_mark) 
    {   
        return true 
    }
    return false

}

function sendMessageFromDk(nickname, msg){
    bot.users.list().then(lt =>{
        let member = lt.members.filter(member=>
            nameCompare(nickname, 
                member.profile.first_name,
                member.profile.last_name)
        )
        let message ='<https://discordapp.com/channels/'+server_id+'/'+msg.channel.id+'|:discord:> ' + 
                       "*"+msg.channel.name.toUpperCase()+"*\n" +
                       "👶"+msg.member.nickname+"\n"+
                       msg.content.replace(/[<][@][!][0-9]*[>]/gm, "@"+nickname)

        if(member.length>0){
            send(member[0].id.split(" "), message);
        }
    })
}


function message(msg,mmsg){

    if (mmsg) msg = mmsg
    delete mmsg

    if (msg.author.bot) return

    if (msg.channel.type == 'dm'){
        let message = msg.content.split(' ')
        
        if (message.length != 3)
            return
        
        let key = message.splice(2,1)
    
        if ( key == "eceSIRz|4w7mvwu" ){
            return
        }
        else if( key == 'V"De#1{Cp1[F8AM' ){
            let member = guild.members.cache.find(m=>m.id == msg.author.id)
            let role = guild.roles.cache.find(role=>role.name == "Менеджер" )
            member.edit({
                nick: message.join(' ')
           })
            member.roles.add(role).then(
                () => {msg.react("👍")}
            )
        }
        else if( key == 'h-0v3jd*>4Pbb_%'){

            let member = guild.members.cache.find(m=>m.id == msg.author.id)

            if (!member){
                msg.reply('', {
                    embed: {
                        color: 16711680,
                        description: "Привет <@"+msg.author.id+">\n\
                                      Не могу найти тебя в Codabra Online\n\
                                      Присоединяйся: discord.gg/vEdEV7v"
                            }
                        })
                return
            }

            if (member.roles.cache.findKey(r=>r.name == "Преподаватель") != -1){
                msg.reply('', {
                    embed: {
                        color: 16711680,
                        description: "Привет <@"+msg.author.id+">\n\
                                      Ты уже преподаватель"
                            }
                        })
                msg.react("👍")
                return
            }

            message_buffer.push({
                msg:msg,
                f_name:message,
            })
            groupOrUserInfo(message, false)
        }
        else{
            return
        }
    }

    let message = msg.content.toLowerCase();
    let support_channel = guild.channels.cache.find(c=>c.name=="посещаемость")
    if (!support_channel) send(admin, "rip посещаемость")

    if (msg.channel.name === 'фио-и-группа') {

        let group;

        if(message.search(/[а-яА-Я][.][0-9а-яА-Я]*[.]?[0-9а-яА-Я]*[-][0-9]+[\s]?[0-9-()]*/gm) != -1){
            group = message.match(/[а-яА-Я][.][0-9а-яА-Я]*[.]?[0-9а-яА-Я]*[-][0-9]+[\s]?[0-9-()]*/gm)[0]
            // for (var i=0;i<g.length;i++){
            //     groups.push(g[i].toUpperCase())
            // }
        }

        if (message.indexOf("преподаватель") != -1 || 
                message.replace(/ё/g,'е').indexOf("стажер") != -1 || 
                message.indexOf("менеджер") != -1 && 
                !msg.member.roles.cache.find(role => role.name == "Преподаватель" || role.name == "Менеджер") ){

            msg.member.createDM().then( (dm) => { 
                dm.send('',{
                embed: {
                    color: 16711680,
                    description: "Чтобы получить доступ к роли Преподавателя или Менеджера\
                                пришли мне ответным сообщением **Имя Фамилию и Ключ**\n\
                                **Ключ** можно найти по этой ссылке: https://www.notion.so/discord-347567d82dae475fa63a7967de571c7f\n\
                                **Пример:** *Оксана Родзянко 4-:#+fq@.)sPz{t*",
                }
            }) })
            msg.delete()
            return
        }

        if (!group) { 
            
            msg.channel.send('',{
                embed: {
                    color: 16711680,
                    description: "Привет <@"+msg.member.id+">\n\
                                  Не удалось найти **группу** в твоем сообщении\n\
                                  Попробуй еще раз, напиши **Имя Фамилию Группу**\n\
                                  **Пример:** *Юлия Беляева О.У1ВВА1-19*\n\
                                  **Если не знаешь какая у тебя группа, посмотри сюда:** https://www.notion.so/2dc2dc0f96ee44ba924d441f98c1ce3f\n\
                                  :warning: Этот канал предназначен только для выдачи доступа к каналу группы\n\
                                  На всякий случай я переслал твое сообщение Администратору"
                        }
                    }).then((m)=>m.delete({ timeout: 120000 }))

            support_channel.send('',{
                embed: {
                    color: 16711680,
                    description: "Не удалось найти **группу** в сообщении\n\
                                  **<@" + msg.member.id + "> пишет:**\n" + msg.content
                }
            })

            msg.delete()
            return

        }

        if (msg.member.roles.cache.find(role => role.name == "Преподаватель" || role.name == "Менеджер")){
            togleRole(msg, group, false )
            return
        }

        message = message.replace(/\n/gm,' ')

        message = message.replace(group.toLowerCase(),'')

        message = message.split(' ')
        
        for (var i=0;i<message.length;i++){
            if (!message[i]) {message.splice(i, 1);i--;}  
        }

        if(message.length != 2) {

            msg.channel.send('',{
                embed: {
                    color: 16711680,
                    description: "Привет <@"+msg.member.id+">\n\
                                  Не удалось найти **Имя Фамилию** в твоем сообщении\n\
                                  Попробуй еще раз, напиши **Имя Фамилию Группу**\n\
                                  **Пример:** *Юлия Беляева О.У1ВВА1-19*\n\
                                  :warning: Этот канал предназначен только для выдачи доступа к каналу группы\n\
                                  На всякий случай я переслал твое сообщение Администратору"
                        }
                    }).then((m)=>m.delete({ timeout: 120000 }))
            
            support_channel.send('',{
                embed: {
                    color: 16711680,
                    description: "Не удалось найти **Имя Фамилию** в сообщении\n\
                                  **<@" + msg.member.id + "> пишет:**\n" + msg.content
                }
            })

            msg.delete()
            return
        }

        let key = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

        message_buffer.push({
            key: key,
            msg:msg,
            group:group,
            f_name:message
        })

        groupAndUserInfo(key, group)

        // groupAndUserInfo(groups, true)

    }
    else{
        let mention = msg.mentions;
        if(!mention.everyone){
            if(mention.members.array().length > 0){
                let members = mention.members.filter(
                    member => member.roles.cache.find(
                        role => role.name=="Преподаватель" || 
                        role.name=="Administrator" ||
                        role.name=="AdMinistrator" ||
                        role.name=="Менеджер"
                        ) 
                    ).array()

                for(let i=0;i<members.length; i++){
                    
                    let nickname;

                    if (!members[i].nickname)
                        nickname = members[i].user.username
                    else
                        nickname = members[i].nickname

                    // g_data.push({
                    //    teacher: {
                    //        first_name:"Артём",
                    //        last_name:"Лева"
                    //    },
                    //    title:"test",
                    //    time:'2020-10-22T02:45:00'
                    // })
                    
                    // g_data.push({
                    //     teacher: {
                    //         first_name:"Артём",
                    //         last_name:"Лева"
                    //     },
                    //     title:"test",
                    //     time:'2020-10-22T01:45:00'
                    //  })

                    if (g_data){
                        let groups = g_data.filter( g=>nameCompare(
                            nickname, 
                            g.teacher.first_name,  
                            g.teacher.last_name) )
                            

                            let ct = new Date()

                            for(var j=0;j<groups.length;j++){
                                let g = groups[j]

                                let gr = new Date(g.time);
                                let cm = Math.round((ct-gr)/60000)

                                if ( cm <= 150 && cm >=  -40 ) {
                                         
                                    if (g.title.toLowerCase().replace(".","").replace(/\s?\((.*)\)/gm,"") == 
                                        msg.channel.name.toLowerCase().replace(".","").replace(/\s?\((.*)\)/gm,"")){
                                            return
                                    }
                                    else{
                                        setTimeout( sendMessageFromDk, 9600000 - cm*60000, nickname, msg )
                                        return
                                    }
                                }

                            }
                            sendMessageFromDk(nickname, msg )
                    }
                }
            }
        }
    }
}



module.exports.timeManagment = timeManagment
global.tInChannel = tInChannel
global.message = message
module.exports.deleteGroups = deleteGroups
module.exports.clearTimmers = clearTimmers
module.exports.checkRole = checkRole
module.exports.checkRoleA = checkRoleA
module.exports.setTeacherRole = setTeacherRole