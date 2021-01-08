const { MessageEmbed, Client } = require('discord.js');
const bot = new Client();
const fs = require('fs');
const color = require('chalk')
const { Menu } = require('discord.js-menu')
const ms = require('ms');
const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cours"
    /*
    host: local or no
    user: name of user
    password: regularly no
    database: name of database 
    */
});

db.connect(function (err) {
    if(err) return console.log('La base de données n\'as pas réussit à ce connecter');
    console.log('Connectée à MYSQL')
})

let sql;

bot.on('message', async message => {

    if(message.author.bot) return;
    
    let prefix = '!'
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    
    // Requête INSERT + SELECT
    db.query(`SELECT * FROM user WHERE user = ${message.author.id}`, async (err, req) => {
        if(err){
            throw err;
        }
        if(req.length < 1) {
            message.channel.send('Vous n\'êtes pas enregistrer dans la base de données')
            sql = `INSERT INTO user (user, username, message) VALUES ('${message.author.id}', '${message.author.username}', '${message.content}')`
        db.query(sql, function(err) {
            if(err) throw err;
        })
        } else if(req.length > 1) {
            message.channel.send('Vous êtes déjà enregistrer')
        }
        
    })

    // Requête SELECT
    if(command === `userinfo`) {
        db.query(`SELECT * FROM user WHERE user = ${message.author.id}`, async (err, req) => {
            if(req.length < 1) return console.log('1')
            message.channel.send(`
            ID: ${req[0].user}
            USERNAME: ${req[0].username}
            MESSAGE: ${req[0].message}
            `)
        })
    }

    // Requête UPDATE
    if(command === `updateuser`){
        let result = args[0];
        db.query(`UPDATE user SET message = '${result}' WHERE user = ${message.author.id}`)
    }

    // Requête DELETE
    if(command === `removeuser`){
        db.query(`DELETE FROM user WHERE user = ${message.author.id}`)
    }

})

/*
Event guildCreate

Insére des informations du serveur 
*/
bot.on('guildCreate', async guild => {
    db.query(`SELECT * FROM server WHERE guild = ${guild.id}`, async (err, req) => {
        let voiceChannel = guild.channels.cache.filter(channel => channel.type === 'voice').size;
        let txtChannel = guild.channels.cache.filter(channel => channel.type === 'text').size;
        let total = voiceChannel + txtChannel;
        sql = `INSERT INTO server (guild, ownerid, memberCount, channelCount) VALUES (${guild.id}, ${guild.owner.id}, ${guild.memberCount}, ${total})`
        db.query(sql, err => {
            if(err) throw err;
        })
    })
})
