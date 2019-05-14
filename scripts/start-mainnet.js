// Set mainnet env vars
process.env.CHAIN_NETWORK = 'mainnet';
process.env.API_HOSTNAME = 'bodhipm.nakachain.org';
process.env.API_PORT = 8888;

// Run start script
require('./start');
