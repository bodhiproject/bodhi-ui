// Set testnet env vars
process.env.API_HOSTNAME = 'dev.puti.io';
process.env.API_PORT = 6767;

// Run build script
require('./build');
