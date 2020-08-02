

function send(who, message){
    for(var i=0;i<who.length;i++){
        bot.chat.postMessage({channel:who[i],text:message})
    }
}

function messageAboutMissTeachers(time_slot){
    time_slot.time = new Date(time_slot.time)
    let message = '*' + time_slot.time.getHours() + ":"
                  + (time_slot.time.getMinutes() < 10 ? '0'
                  + time_slot.time.getMinutes() : time_slot.time.getMinutes()) +'*\n'

    for(var i=0;i<time_slot.teachers.length;i++){
        if (!time_slot.teachers[i].status) continue

        message += time_slot.teachers[i].start ? ':star2: ' : '';
        message += time_slot.teachers[i].group + ' ';
        message += ':' + time_slot.teachers[i].status.status + ': ';
        message += time_slot.teachers[i].status.version ?
        ':' + time_slot.teachers[i].status.version + ': ' : '';
        message += time_slot.teachers[i].first_name + ' ';
        message += time_slot.teachers[i].last_name + ' ';
        message += time_slot.teachers[i].in_channel ? ':heavy_check_mark:' : ':x:' ;
        message += '\n'
    }

    send(admin, message)
    send(miss_teachers, message)

}

function messageAboutMissParticipants(lesson){
    let message = lesson.start ? ':star2: ' : ''; 
    message += '*' + lesson.title.toUpperCase() + '*\n';
    for(var i=0;i<lesson.participants.length;i++){
        if(!lesson.participants[i].in_channel){
            message += lesson.participants[i].last_name+' '+lesson.participants[i].first_name+' :heart:';
            message += lesson.participants[i].lead ? ' '+'<https://codabra.amocrm.ru/leads/detail/'+lesson.participants[i].lead+'|:slack_call:>\n' : '\n'
        }
    }
    send(admin, message)
    send(miss_participants, message)
}

global.send = send
module.exports.messageAboutMissParticipants = messageAboutMissParticipants
module.exports.messageAboutMissTeachers = messageAboutMissTeachers