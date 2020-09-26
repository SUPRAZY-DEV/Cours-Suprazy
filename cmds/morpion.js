const {MessageEmbed} = require('discord.js')
const emojis = { "1️⃣": "1" , "2️⃣": "2", "3️⃣": "3", "4️⃣": "4", "5️⃣": "5", "6️⃣": "6", "7️⃣": "7", "8️⃣": "8", "9️⃣": "9" }

module.exports.run = async (bot, message, args) => {    
    let embed = new MessageEmbed()
    .setDescription('Qui veux faire un match ? `2 joueurs requis`')
    .setColor('RANDOM')
  
    message.channel.send(embed).then(async msg => {
        msg.react('🗡️')
        let filter = (reaction, user) => !user.bot && reaction._emoji.name === '🗡️'
        let reaction = await msg.awaitReactions(filter, {max: 2})
        let number = Math.floor(Math.random() * 899) + 100
        let channel = await msg.guild.channels.create(`morpion-${number}`, {type: 'text', parent: '759474716410380300', permissionOverwrites: [{id: message.guild.id, deny: ["VIEW_CHANNEL"]}, {id: reaction.get("🗡️").users.cache.filter(user => !user.bot).array()[0].id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']}, {id: reaction.get("🗡️").users.cache.filter(user => !user.bot).array()[1].id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']}]})
      
      let embed = new MessageEmbed()
      .setDescription(`🗡️ FIGHT
      ${reaction.get("🗡️").users.cache.filter(user => !user.bot).array()[0]} VS ${reaction.get("🗡️").users.cache.filter(user => !user.bot).array()[1]}
      `)
      .setColor('RANDOM')
      channel.send(`${reaction.get("🗡️").users.cache.filter(user => !user.bot).array()[0]} VS ${reaction.get("🗡️").users.cache.filter(user => !user.bot).array()[1]}`)
      let morpion = await channel.send(embed)

      let players = [
        {user: `${reaction.get("🗡️").users.cache.filter(user => !user.bot).array()[0]}`, reaction: "X"},
        {user: `${reaction.get("🗡️").users.cache.filter(user => !user.bot).array()[1]}`, reaction: "O"}
    ]
        let Morpion = new MessageEmbed()
.setTitle('Game : Morpion')
.setColor('RANDOM')
.setDescription
(`Player : ${players[0].user}
\`\`\`
1  |  2  |  3
4  |  5  |  6
7  |  8  |  9
\`\`\``)
    morpion.edit(Morpion).then(async msg => {
        await Promise.all(["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"].map(r => msg.react(r)));
        let gameStatus = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        let winners;
        await game(players, msg, gameStatus, winners)
    })
})
function game(players, msg, gameStatus, winners) {
    const win = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    new Promise(async (resolve, reject) => {
        do {
            if(winners) return;
            await player(players, msg, gameStatus, 0);
            if(await checkwinner(gameStatus, win, msg, players, 0, winners)) {
                resolve();
                break;
            }
            if(await checktie(gameStatus, winners, msg)) {
                resolve(); 
                break;
            }
            if(winners) return;
            await player(players, msg, gameStatus, 1);
            if(await checkwinner(gameStatus, win, msg, players, 1, winners)) { 
                resolve();
                break;
            }
            if(await checktie(gameStatus, winners, msg)) {
                resolve(); 
                break;
            }
        }
        while(!winners)
    })
}
async function player(players, msg, gameStatus, player) {
    let reaction = (await msg.awaitReactions((reaction, user) => ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"].includes(reaction.emoji.name) && !user.bot && gameStatus[parseInt(emojis[reaction.emoji.name])-1] === emojis[reaction.emoji.name] && user.id === players[player].user.slice(2, -1), {max: 1})).first();
    gameStatus[parseInt(emojis[reaction.emoji.name])-1] = players[player].reaction
    msg.edit({ embed: 
{ description: 
`Player : ${player === 0 ? players[1].user:players[0].user}\`\`\` 
${emojis[reaction.emoji.name] === "1" ? players[player].reaction:gameStatus[0]}  |  ${emojis[reaction.emoji.name] === "2" ? players[player].reaction:gameStatus[1]}  |  ${emojis[reaction.emoji.name] === "3" ? players[player].reaction:gameStatus[2]}
${emojis[reaction.emoji.name] === "4" ? players[player].reaction:gameStatus[3]}  |  ${emojis[reaction.emoji.name] === "5" ? players[player].reaction:gameStatus[4]}  |  ${emojis[reaction.emoji.name] === "6" ? players[player].reaction:gameStatus[5]}
${emojis[reaction.emoji.name] === "7" ? players[player].reaction:gameStatus[6]}  |  ${emojis[reaction.emoji.name] === "8" ? players[player].reaction:gameStatus[7]}  |  ${emojis[reaction.emoji.name] === "9" ? players[player].reaction:gameStatus[8]}
\`\`\``}});
}
}
function checktie(gameStatus, winners, msg) {
    if(gameStatus.every(value => ["O", "X"].includes(value))) {
        winners = "Égalité"
                msg.edit({embed: 
                    { description: `
Aucun gagnant pour ce match.
Dans 5 secondes ce salon sera supprimé`
}}) 
            setTimeout(() => {
                msg.channel.delete()
            }, 5000)
            return true;
    }
}
async function checkwinner(gameStatus, win, msg, players, player, winners) {
            for(const trio of win) {
                let one = trio[0];
                let two = trio[1]
                let three = trio[2];
                if(gameStatus[one] === gameStatus[two] && gameStatus[one] === gameStatus[three]) {
                    winners = `Player ${player}`
                msg.edit({embed: 
                    { description: `
Le joueur ${players[player].user} a gagné la partie
Dans 5 secondes ce salon sera supprimé`
}}) 
            setTimeout(() => {
                msg.channel.delete()
            }, 5000)
return true;
                
                }
}
}
module.exports.help = {
    name: 'morpion'
}