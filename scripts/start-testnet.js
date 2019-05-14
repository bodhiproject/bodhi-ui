// Set testnet env vars
process.env.CHAIN_NETWORK = 'testnet';
process.env.API_HOSTNAME = 'testnet.bodhipm.nakachain.org';
process.env.API_PORT = 9999;

// Run start script
require('./start');
