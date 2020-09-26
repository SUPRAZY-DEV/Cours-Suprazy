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

    if(!message.member.hasPermission('ADMINISTRATOR')) return;
   db.query(`SELECT * FROM server WHERE guildID = ${message.guild.id}`, async (err, req) => {
       if(req.length > 1) {
           return;
       } else {

        let lang = require(`../language/${req[0].lang}`)

        sql = `UPDATE server SET raid = 'no'`
        await db.query(sql, function (err) {
            if(err) throw err;
        })

        message.guild.channels.cache.filter(channel => channel.type === 'text').forEach( async channel => {
            await channel.updateOverwrite(message.guild.id, {
                SEND_MESSAGES: null,
                ADD_REACTIONS: null
            }).catch((e) => {
                message.channel.send('ERROR')
            })

        }) 
       }
   })
}

module.exports.help = {
    name: 'raidoff'
}