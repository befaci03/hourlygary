const gif = "https://tenor.com/view/rules-cat-gangster-dont-forget-ur-roots-boss-up-gif-14398010971330484422";

module.exports = {
    name: "rules",
    execute(client, message, args) {
        message.reply(gif);
    }
}