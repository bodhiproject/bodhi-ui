// Set testnet env vars
process.env.CHAIN_NETWORK = 'testnet';
process.env.API_HOSTNAME = 'dev.puti.io';
process.env.API_PORT = 6767;

// Run start script
require('./start');
