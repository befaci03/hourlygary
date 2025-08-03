require('dotenv').config();
const dbPath = require('path').join(__dirname, '..', 'db', 'servers.json');
const db = require('../db/servers.json');
const fs = require('fs');

module.exports = {
    name: "setup",
    async execute(client, message, args) {
        message.channel.sendTyping();
        let channel;
        const srvId = message.guild.id;

        if (args[0]) {
            const c = message.guild.channels.cache.find(chnl => args[0] === chnl.id);
            if (!c) return message.reply("Invalid channel ID");

            if (c.guild.id !== srvId) return message.reply("The channel is non-existant in this server");
            channel = c;
        } else channel = message.channel;

        if (!message.channel.isText()) return message.reply('Hold up! This channel isn\'t a simple text channel, cannot submit the change. [ERR_184]');
        const perms = channel.permissionsFor(message.guild.members.me);
        if (!perms || !perms.has(['SEND_MESSAGES', 'VIEW_CHANNEL'])) return message.reply("I can't send message on this channel. [ERR_176]");

        try {
            db[srvId] = channel.id;
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 0), 'utf8');
        } catch (error) {
            console.error(error)
            return message.reply('Cannot apply the changes [ERR_354] (failed to save the database)')
        }
        message.reply(`${client.user.displayName} will now post every ${process.env.INTERVAL} in <#${channel.id}>\nType \`${process.env.PREFIX}start\` and the bot will start sending Garys.`)
    }
}
