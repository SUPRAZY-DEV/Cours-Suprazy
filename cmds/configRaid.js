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

   db.query(`SELECT * FROM server WHERE guildID = ${message.guild.id}`, (err, req) => {
       if(req.length > 1) {
           return;
       } else {

        let lang = require(`../language/${req[0].lang}`)

        if(req[0].raid === 'no') {
            sql = `UPDATE server SET raid = 'on'`
            db.query(sql, function (err) {
                if(err) throw err;
            }) 
            message.channel.send(lang.TEXT_COMMAND_RAIDON)
        } else if (req[0].raid === 'on') {
            sql = `UPDATE server SET raid = 'no'`
            db.query(sql, function (err) {
                if(err) throw err;
            })   
            message.channel.send(lang.TEXT_COMMAND_RAIDOFF)
        }
       }
   })
}

module.exports.help = {
    name: 'configRaid'
}