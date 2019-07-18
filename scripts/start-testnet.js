// Set testnet env vars
process.env.NETWORK = 'testnet';
process.env.API_HOSTNAME = 'testapi.puti.io';
process.env.SSL = 'true';

// Run start script
require('./start');
