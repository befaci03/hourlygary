const { Client } = require('discord.js-selfbot-v13');

const env = process.env;
const user = new Client();



user.login(env.TOKEN);