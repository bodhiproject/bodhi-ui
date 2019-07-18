// Set local env vars
process.env.NETWORK = 'mainnet';
process.env.API_HOSTNAME = 'api.puti.io';
process.env.SSL = 'true';

// Run build script
require('./build');
