const {MessageEmbed} = require('discord.js')

module.exports.run = async (bot, message, args) => {

   let embed = new MessageEmbed()
  .setDescription('Qui veux faire un match ?')
  .setColor('RANDOM')

  message.channel.send(embed).then(async msg => {
      msg.react('🗡️')

      let filter = (reaction, user) => !user.bot && reaction._emoji.name === '🗡️'
      let reaction = await msg.awaitReactions(filter, {max: 2})
      let number = Math.floor(Math.random() * 899) + 100
      let channel = await msg.guild.channels.create(`match-${number}`, {type: 'text', parent: '735630838951182337', permissionOverwrites: [{id: message.guild.id, deny: ["VIEW_CHANNEL"]}, {id: reaction.get("🗡️").users.cache.filter(user => !user.bot).array()[0].id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']}, {id: reaction.get("🗡️").users.cache.filter(user => !user.bot).array()[1].id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']}]})
    
    let embed = new MessageEmbed()
    .setDescription(`🗡️ FIGHT
    ${reaction.get("🗡️").users.cache.filter(user => !user.bot).array()[0]} VS ${reaction.get("🗡️").users.cache.filter(user => !user.bot).array()[1]}
    `)
    .setColor('RANDOM')
    channel.send(embed)
    })
    
}

module.exports.help = {
    name: 'matchmaking'
}