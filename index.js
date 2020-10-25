const Discord = require('discord.js');
const dragon = require('./dragon.js');
global.client = new Discord.Client();
let hr = new Date().getHours();

const token = 'xoxb-64132737991-1109136125201-gTMYUBnjWJxLR2tgLcBobc36'
let Slack = require('slack')
global.bot = new Slack({token})

global.server_id = 687964407975772160
global.miss_participants = "UHZ8C1QVB".split(' ');
global.miss_teachers = "UHZ8C1QVB".split(' ');
global.admin = "UHZ8C1QVB".split(' ');

global.options = {
    protocol: 'https:',
    headers: {
        'cookie': 'auth_token='+"d6b2b05a81a486be6fd55941670cf18ce72837b6"+'; path=/; domain=.dragonapi.codabra.org;',
        'Content-Type':'application/json',
    }
}


global.guild;

client.on('ready', () => {
    guild = client.guilds.cache.find(guild=>guild.id==server_id);

    send(admin, `Logged in as ${client.user.tag}!`);

    if (!guild) send(admin, 'Не найден сервер SERVER_ID: ' + server_id)


    dragon.Info()
    setInterval(dragon.Info, (24-hr) * 3600000 )

})


client.on('message', message )
client.on('messageUpdate', message )

// client.on('voiceStateUpdate', voiceChange )

// client.on('guildMemberSpeaking', (mem, t) => {
//     client.voice.broadcasts
//     console.log(t.bitfield)
// })

client.login("NzA1MzUxNjc5MjIyMDg3NzA0.XqqeUQ.7q2nm5sKDpCkI3g0rwsv6CgUElM");  