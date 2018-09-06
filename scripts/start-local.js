// Set local env vars
process.env.API_HOSTNAME = 'localhost';
process.env.API_PORT = 6767;
process.env.PROTOCOL_HTTP = 'http';
process.env.PROTOCOL_WS = 'ws';

// Run start script
require('./start');
