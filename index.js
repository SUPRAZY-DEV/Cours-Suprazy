const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config.json")
const fs = require('fs');
const mysql = require('mysql');
bot.sticky = new Discord.Collection()

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cours"
})
let sql;
bot.commands = new Discord.Collection();

fs.readdir('./cmds/', (err, files) => {
    if(err) console.log(err)
    let jsfile = files.filter(f => f.split('.').pop() === 'js')
    if(jsfile.length <= 0) {
        console.log('[HANDLER]: Aucune commande trouvée')
    }

    jsfile.forEach((f, i) => {
    let props = require(`./cmds/${f}`);
    console.log(`[HANDLER]: ${f} ok !`)
    bot.commands.set(props.help.name, props)
    })
})

bot.on("ready", async () => {
    console.log(`(${bot.user.username}): Online`)

    let statuses = [
        "i'm not bot"
    ]

    setInterval(function() {
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        bot.user.setActivity(status, {type: "WATCHING"})
    }, 5000)
})

// Room Box (Automatic)
bot.on('voiceStateUpdate', async (oldVoice, newVoice) => {
    if(!newVoice.channel) return;
    let member = newVoice.member;
    let guild = newVoice.guild;
    if(newVoice && newVoice.channel.id == '743890689531576461') {
        let channel = await guild.channels.create(member.user.username, {type: 'voice', permissionOverwrites: [{id: member.id, allow: ["CONNECT", "SPEAK"]}, {id:oldVoice.guild.id, deny: ['CONNECT']}]})
        newVoice.setChannel(channel)
    }
})
bot.on("message", async message => {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    
    // Sticky Messages (dependency: 'cmds/addsticky.js')
    if(bot.sticky.has(message.channel.id)) {
        let msg = await message.channel.messages.fetch(bot.sticky.get(message.channel.id));
        await msg.delete()
        let new_message = await msg.channel.send(msg.content);
        bot.sticky.set(message.channel.id, new_message.id)
    }
    
    let prefix = config.data.PREFIX;
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    let commandFile = bot.commands.get(command.slice(prefix.length))
    if(commandFile) commandFile.run(bot, message, args)

    // Language dependency
    db.query(`SELECT * FROM server WHERE guildID = ${message.guild.id}`, (err, req) => {
        if(req.length < 1) {
            sql = `INSERT INTO server (guildID, lang, raid) VALUES ('${message.guild.id}', 'en', 'no')`
            db.query(sql, function (err) {
                if(err) throw err;
            })
        }

        // Config Raid (dependency: 'cmds/configRaid.js')
        if(req[0].raid === 'no') {
            return;
        } else if (req[0].raid === 'on') {
            message.guild.channels.cache.filter(channel => channel.type === 'text').forEach( async channel => {
                await channel.updateOverwrite(message.guild.id, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                }).catch((e) => {
                    message.channel.send('ERROR')
                })
            }) 
        }
    });
});

bot.login(config.data.TOKEN)
