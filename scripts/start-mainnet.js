// Set mainnet env vars
process.env.CHAIN_NETWORK = 'mainnet';
process.env.API_HOSTNAME = 'puti.io';
process.env.API_PORT = 8989;

// Run start script
require('./start');
