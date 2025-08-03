require('dotenv').config();
const { Client, Collection } = require('discord.js-selfbot-v13');
const fs = require('fs');
const { join: path } = require('path');

const env = process.env;
const client = new Client();

let startTimer = Date.now();
client.once('ready', () => {
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
    if (!message.content.startsWith(env.PREFIX)) return;

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
});

// gary time :3

client.login(env.TOKEN);