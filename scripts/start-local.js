// Set local env vars
process.env.CHAIN_NETWORK = 'testnet';
process.env.API_HOSTNAME = 'localhost:9999';
process.env.SSL = 'false';

// Run start script
require('./start');
