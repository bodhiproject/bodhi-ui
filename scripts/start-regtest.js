// Set regtest env vars
process.env.CHAIN_NETWORK = 'regtest';
process.env.API_HOSTNAME = 'test.puti.io';
process.env.API_PORT = 5555;

// Run start script
require('./start');
