// Set local env vars
process.env.NETWORK = 'testnet';
process.env.API_HOSTNAME = 'testapi.puti.io';
process.env.SSL = 'true';

// Run build script
require('./build');
