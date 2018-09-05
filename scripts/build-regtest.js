// Set regtest env vars
process.env.API_HOSTNAME = 'test.puti.io';
process.env.API_PORT = 5555;

// Run build script
require('./build');
