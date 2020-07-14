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

    ['Даня','Даниил'],
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

function setTimmer(minutes, data, func){
    for(var i=0;i<data.length;i++){
        let current_time = new Date();
        let less_date = new Date (data[i].time);
        less_date.setMinutes( less_date.getMinutes() + minutes );
        if (( less_date - current_time) <= 0 ){
            continue
        }
        setTimeout(func, less_date - current_time, data[i])
    }
}


function timeManagment(lesson_data){
    setTimmer(+10, lesson_data, pInChannel)

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
            first_name: lesson_data[i].teacher.first_name,
            last_name:lesson_data[i].teacher.last_name,
        })

    }

    setTimmer(-35, time_slots, tInChannel )
}

function tInChannel(time_slot){

    for(var i=0;i<time_slot.teachers.length;i++){
        let channel = guild.channels.cache.find(channel => 
            channel.type =='voice' && 
            time_slot.teachers[i].group.toLowerCase().replace(/\((.*)\)/gm,"") == 
            channel.name.toLowerCase().replace(/\((.*)\)/gm,"") )

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
                                    time_slot.teachers[i].first_name + ' ' + 
                                    time_slot.teachers[i].last_name + '*'); continue}

        time_slot.teachers[i].status = mStatus(member)

    }

    out.messageAboutMissTeachers(time_slot)

}

function pInChannel(lesson){

    let in_channel_counter = 0;
    let channel = guild.channels.cache.find(channel => 
                    channel.type =='voice' && 
                    lesson.title.toLowerCase().replace(/\((.*)\)/gm,"") == 
                    channel.name.toLowerCase().replace(/\((.*)\)/gm,"") )
    
    if (!channel) return

    for(var i=0;i<lesson.participants.length;i++){
        let member = inChannel(lesson.participants[i].first_name, 
                               lesson.participants[i].last_name, channel)
        if (member){
            lesson.participants[i].in_channel = true
            in_channel_counter++
            if (in_channel_counter == lesson.participants.length){
                send(admin, ':ribbon: *' + lesson.title.toUpperCase() + '\n Все в канале*')
                send(miss_participants, ':ribbon: *' + lesson.title.toUpperCase() + '\n Все в канале*')
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
    

function inChannel(first_name, last_name, channel){
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
        if (!members[i].nickname) continue
        let nickname = members[i].nickname.split(' ');
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

module.exports.timeManagment = timeManagment