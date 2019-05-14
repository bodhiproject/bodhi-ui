// Set mainnet env vars
process.env.NETWORK = 'mainnet';
process.env.API_HOSTNAME = 'bodhipm.nakachain.org';
process.env.SSL = 'true';

// Run start script
require('./start');
