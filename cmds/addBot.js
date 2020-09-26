const {MessageEmbed} = require('discord.js')

module.exports.run = async (bot, message, args) => {

   let embed = new MessageEmbed()
   .setTitle('Ajoutez le bot')
   .setDescription(`Pour ajouter le bot, cliquez [ici](https://www.youtube.com)`)

   message.channel.send(embed)
}

module.exports.help = {
    name: 'addBot'
}