// Set mainnet env vars
process.env.CHAIN_NETWORK = 'mainnet';
process.env.API_HOSTNAME = 'bodhipm.nakachain.org';
process.env.SSL = 'true';

// Run start script
require('./start');
