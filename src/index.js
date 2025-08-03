console.log('-----------------------[ STARTUP ]-----------------------');
require('dotenv').config();
const { Client, Collection } = require('discord.js-selfbot-v13');
const fs = require('fs');
const { join: path } = require('path');


const buildmsg = require('./utils/buildPost');
const getGary = require('./utils/getGary');
const formatInterval = require('./utils/formatinterval');

const env = process.env;
const client = new Client();

const timersPath = path(__dirname, 'db/timers.json');
const serversPath = path(__dirname, 'db/servers.json');
function loadTimers() {
    if (!fs.existsSync(timersPath)) return {};
    return JSON.parse(fs.readFileSync(timersPath, 'utf8'));
}
function loadServers() {
    if (!fs.existsSync(serversPath)) return {};
    return JSON.parse(fs.readFileSync(serversPath, 'utf8'));
}

let startTimer = Date.now();
client.once('ready', () => {
    console.log('')
    const timeToConnect = Date.now() - startTimer;
    console.log('-----------------------[  READY  ]-----------------------');
    console.log(`${client.user.username} connected to Discord in ${timeToConnect}ms!`);
    console.log('')
    console.log('-----------------------[ CONSOLE ]-----------------------');
});

// some things for account's sake
client.on('callCreate', (call) => setTimeout(() => client.user.stopRinging(call.channel.id), 1500));

// command handling
client.commands = new Collection();

const commandFiles = fs.readdirSync(path(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`[+] Command loaded: ${command.name}`);
}

client.on('messageCreate', async (message) => {
    if (message.author.id === client.user.id) return;
    const delay = 3000;
    if (!message.content.startsWith(env.PREFIX)) return;
    await message.channel.sendTyping();
    
    setTimeout(async () => {
        const args = message.content.slice(env.PREFIX.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;

        try {
            await command.execute(client, message, args);
        } catch (error) {
            console.error(`[ERROR] Command ${commandName}:`, error);
            message.reply('cannot proceed the command [ERR_314]');
        }
    }, delay);

});

// gary time :3
client.once('ready', () => {
    const timers = loadTimers();
    const servers = loadServers();
    client.garyIntervals = {};
    for (const guildId in timers) {
        if (timers[guildId]) {
            const sendGary = async () => {
                try {
                    const gary = await getGary(process.env.GARYTHECAT_API);

                    const guild = client.guilds.cache.get(guildId);
                    if (!guild) return;

                    const channelId = servers[guildId];
                    let channel = null;
                    if (channelId) {
                        channel = guild.channels.cache.get(channelId);
                    }
                    if (!channel) return;

                    const msg = await channel.send(buildmsg(gary.res, gary.i));
                    await msg.react('❤️‍🔥');
                } catch (error) {
                    console.error('Failed to get Gary (reboot):', error);
                }
            };
            client.garyIntervals[guildId] = setInterval(sendGary, formatInterval(process.env.INTERVAL));
            console.log(`[SUCCESS] Timer relaunched for server ${guildId}`);
        }
    }
});

client.login(env.TOKEN);