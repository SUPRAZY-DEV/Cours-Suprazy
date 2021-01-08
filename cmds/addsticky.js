const {MessageEmbed} = require('discord.js')
module.exports.run = async (bot, message, args) => {
    
    let msg = await message.channel.messages.fetch(args[0]);
    bot.sticky.set(message.channel.id, msg.id);
    message.channel.send(`\`\`${msg.content}\`\` a bien été ajouté au sticky notes.`);
}

module.exports.help = {
    name: 'addsticky'
}
