module.exports = {
    name: "about",
    execute(client, message, args) {
        message.reply(`I'm a selfbot that post Garys every ${process.env.INTERVAL} on a channel, by doing \`${process.env.PREFIX}setup\` you can set it up.\nVersion: ${require('../../package.json').version}\n\nI'm open source! https://github.com/Befaci03/hourlygary`);
    }
}