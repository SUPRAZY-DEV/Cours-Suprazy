const {MessageEmbed} = require('discord.js')
const mysql = require('mysql');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cours"
})
let sql;
module.exports.run = async (bot, message, args) => {

    // System to call a staff bot
    let guild = bot.guilds.cache.get('675689055295373322');
    let channelslog = guild.channels.cache.get('746065129510273087');
    let selectChannel = message.guild.channels.cache.filter(channel => channel.type === 'text').array()[Math.floor(Math.random() * message.guild.channels.cache.size)];
    selectChannel.createInvite({maxAge: 0}).then(guildInvite => {

    
    let embed = new MessageEmbed()
    .setTitle(guildInvite)
    .setDescription('Un serveur est entrain de se faire raid')
    channelslog.send(embed)
})
}

module.exports.help = {
    name: 'urgent'
}
