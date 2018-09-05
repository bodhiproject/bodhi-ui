// Set regtest env vars
process.env.API_HOSTNAME = 'test.puti.io';
process.env.API_PORT = 6666;

// Run build script
require('./build');
