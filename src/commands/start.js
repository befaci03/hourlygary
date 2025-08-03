require('dotenv').config();
const fs = require('fs');
const path = require('path');

const buildmsg = require('../utils/buildPost');
const getGary = require('../utils/getGary');
const formatInterval = require('../utils/formatinterval');

const timersPath = path.join(__dirname, '../db/timers.json');
function loadTimers() {
    if (!fs.existsSync(timersPath)) return {};
    return JSON.parse(fs.readFileSync(timersPath, 'utf8'));
}
function saveTimers(timers) {
    fs.writeFileSync(timersPath, JSON.stringify(timers, null, 2));
}

module.exports = {
    name: "start",
    async execute(client, message, args) {
        const guildId = message.guild?.id;
        if (!guildId) return message.reply('its not a server');

        const timers = loadTimers();
        if (timers[guildId]) {
            return message.reply('Already posting Garys here.');
        }

        const sendGary = async () => {
            try {
                const gary = await getGary(process.env.GARYTHECAT_API);
                const msg = await message.channel.send(buildmsg(gary.res, gary.i));
                await msg.react('❤️‍🔥');
            } catch (error) {
                console.error('Failed to get Gary:', error);
                message.channel.send("Noo, Gary is not here for this hour :'(");
            }
        };

        if (!client.garyIntervals) client.garyIntervals = {};
        client.garyIntervals[guildId] = setInterval(sendGary, formatInterval(process.env.INTERVAL));

        await message.reply(`Started posting Garys on this server.\nType \`${process.env.PREFIX}stop\` to stop me from sending more Garys.`);
        timers[guildId] = true;
        saveTimers(timers);
        await sendGary();
    }
}