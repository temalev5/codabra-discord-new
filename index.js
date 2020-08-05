const Discord = require('discord.js');
const dragon = require('./dragon.js');
global.client = new Discord.Client();
let hr = new Date().getHours();

const token = process.env.token
let Slack = require('slack')
global.bot = new Slack({token})

global.server_id = process.env.server_id
global.miss_participants = process.env.miss_participants.split(' ');
global.miss_teachers = process.env.miss_teachers.split(' ');
global.admin = process.env.admin.split(' ');

global.options = {
    protocol: 'https:',
    headers: {
        'cookie': 'auth_token='+process.env.cookie+'; path=/; domain=.dragonapi.codabra.org;',
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

client.login(process.env.discord);
