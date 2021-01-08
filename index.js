const Discord = require('discord.js');
const bot = new Discord.Client();
let dejavu = new Map();
 // Map des utilisateurs qui ont un ticket ouvert ou en cours
 let time = new Map();
 // Map des utilisateurs qui ont un ticket récemment fermé;
let ticket = 0;
// Le nombre de tickets créés

bot.on("message", message => {
     if (message.channel.type === "dm") {
         bot.emit("messageprivee", message)
         // Vérification que le channel est bien un message privé
         bot.emit("messageprive", message)
         // Déclenchement de l'event "messageprivee"
     }
 })

bot.on("messageprivee", message => {
 if (time.has(message.author.id)) return message.channel.send("Tu as fermé un ticket trop récemment.");
 // Vérification que l'utilisateur n'as pas eu de ticket récemment
 if (!dejavu.has(message.author.id)) {
     // Vérification que l'utilisateur n'a pas de ticket ouvert en en cours
     let guild = client.guilds.cache.get("731965139653230592");
     // On prend en compte le serveur
     let channel = client.channels.cache.get("731965139653230595") // message.guild.channels.cache.find(channel => channel.name === "LE NOM DU CHANNEL")
     // On prend en compte le channel des staffs (dans lequel les messages seront envoyeés)
     dejavu.set(message.author.id, message.channel.id)
     // Ajout de l'utilisateur dans la map (l'utilisateur a un ticket)
     message.channel.send("Votre ticket a bien été pris en compte.")
     // Message de confirmation pour l'utilisateur
     let messagetostaff = await channel.send(message.content);
     // Envoie du message de l'utilisateur dans le channel staff
     await messagetostaff.react("❌");
     // Réaction "annuler" sur la demande de ticket
     await messagetostaff.react("🟢");
     // Réaction "accepter" sur la demande de ticket
     let role = guild.roles.cache.get("731965290820272169") // message.guild.roles.cache.find(role => role.name === "NOM DU ROLE");
     // Le rôle staff que la personne doit avoir pour accepter/refuser
     try {
         let filtre = (reaction, user) => ["❌", "🟢"].includes(reaction.emoji.name) && !user.bot && guild.member(user.id).roles.cache.has(role);
         // Vérification que la réaction est ❌ ou 🟢 et que l'utilisateur ne soit pas le bot, et que l'utilisateur ait le rôle staff
         let reactionCollection = await messagetostaff.awaitReactions(filtre, {
             max: 1,
             time: 86400000
         });
         // Collection des réactions ajoutées dans le temps imparti (24h)
         let choix = reactionCollection.get("❌") || reactionCollection.get("🟢");
         // La réaction qui a été ajoutée, soit ❌ ou 🟢;
         if (choix.emoji.name === "❌") {
             // Si le staff refuse
             message.author.send("Votre ticket a été refusé.");
             // Message de refus envoyé à l'utilisateur
             dejavu.delete(message.author.id)
             // Suppression de l'utilisateur dans la map des tickets ouverts
             time.set(message.author.id, message.channel);
             // Ajout de l'utilisateur dans la map des tickets récents
             setTimeout(() => {
                 // Délai pour que l'utilisateur ne puisse pas ouvrir des tickets toutes les secondes
                 time.delete(message.author.id);
                 // Suppresion de l'utilisateur dans la map des tickets récents
             }, 100000)
             // Après 100 secondes
         } else {
             // Si le staff a validé
             message.author.send("Votre ticket a été accepté.");
             // Message d'acceptation du ticket envoyé à l'utilisateur
             ticket++
             // Le nombre de ticket augmente
             let newchannel = await channel.guild.channels.create(`ticket-${ticket}`, {
                 // Création du channel avec ce nom "ticket-{numero}"
                 type: "text",
                 // Type du channel pour que ce soit un channel textuel
                 permissionOverwrites: [
                     // Les permissions du channel
                     {
                         id: message.author.id,
                         // L'utilisateur qui a demandé le ticket
                         allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "ADD_REACTIONS"]
                         // Il puisse voir le channel, envoyer des messages, et ajouter des réactions
                     },
                     {
                         id: channel.guild.id,
                         // @everyone
                         deny: ["VIEW_CHANNEL"]
                         // Interdiction de voir le channel
                     },
                     {
                         id: role.id,
                         // Le rôle staff
                         allow: ["SEND_MESSAGE", "VIEW_CHANNEL", "ADD_REACTIONS", "MANAGE_MESSAGES"]
                         // Il puisse voir le channel, envoyer des messages et gérer les messages
                     }
                 ]
             })
             newchannel.send(`Le ticket de ${user.username} a été accepté. Pour la raison **${message.content}**`);
             // Message de confirmation de la création du channel dans le nouveau channel
         }
     } catch (err) {
         console.log(err)
         // Console.log s'il y a une erreur
         message.author.send("Votre requête n'a pas été convaincante.");
         // Envoie du message que le staff n'a pas pu ajouter de réaction dans le temps imparti
         dejavu.delete(message.author.id);
         // Suppression de l'utilisateur dans la map des tickets ouverts
         time.add(message.author.id, message.channel);
         // Ajout de l'utilisateur dans la map des tickets récents
         setTimeout(() => {
             // Délai pour que l'utilisateur ne puisse pas créer de ticket dans les secondes qui suivent
             time.delete(message.author.id);
             // Suppression de l'utilisateur dans les tickets récents
         }, 10000);
         // Après 10 secondes
     }
 }
})

bot.login('YOUR TOKEN')
