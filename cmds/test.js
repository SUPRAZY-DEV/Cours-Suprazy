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

    
    // Test language system
   db.query(`SELECT * FROM server WHERE guildID = ${message.guild.id}`, (err, req) => {
       if(req.length > 1) {
           return;
       } else {

        let lang = require(`../language/${req[0].lang}`)
        const embed = new MessageEmbed()
        .setDescription(lang.TEXT_COMMAND_TEST)

        message.channel.send(embed)
       }
   })
}

module.exports.help = {
    name: 'test'
}
