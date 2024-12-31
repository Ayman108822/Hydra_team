const Discord = require("discord.js");
const pm2 = require("pm2");

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
        return;
    }

    pm2.connect(function(err) {
        if (err) {
            console.error(err);
            return;
        }

        pm2.restart("bot", function(err, apps) {
            if (err) {
                console.error(err);
                return;
            }

            pm2.disconnect();
        });
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['restart', 'reboot'],
    permLevel: 3
};

exports.help = {
    name: 'restart',
    description: 'Restarts the bot.',
    usage: 'restart'
};
