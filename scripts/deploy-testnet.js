// Set local env vars
process.env.NETWORK = 'testnet';
process.env.API_HOSTNAME = 'testnet.bodhipm.nakachain.org';
process.env.SSL = 'true';

// Run build script
require('./build');
