const fs = require('fs');
const path = require('path');
const timersPath = path.join(__dirname, '../db/timers.json');

function loadTimers() {
    if (!fs.existsSync(timersPath)) return {};
    return JSON.parse(fs.readFileSync(timersPath, 'utf8'));
}

function saveTimers(timers) {
    fs.writeFileSync(timersPath, JSON.stringify(timers, null, 2));
}

module.exports = {
    name: "stop",
    async execute(client, message, args) {
        const guildId = message.guild?.id;
        if (!guildId) return message.reply('its not a server');

        const timers = loadTimers();
        if (!timers[guildId]) {
            return message.reply('I\'m already not posting Garys here.');
        }

        // Arrêter l'intervalle
        if (client.garyIntervals && client.garyIntervals[guildId]) {
            clearInterval(client.garyIntervals[guildId]);
            delete client.garyIntervals[guildId];
        }

        timers[guildId] = false;
        saveTimers(timers);

        message.reply(`Stopped posting Garys on this server.\nType \`${process.env.PREFIX}start\` to let me post Garys again.`);
    }
}
