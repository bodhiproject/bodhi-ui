const { exec } = require('child_process');

console.log('Building mainnet UI...');
exec('npm run build:mainnet --output=/var/www/bodhi/mainnet');

console.log('Building testnet UI...');
exec('npm run build:testnet --output=/var/www/bodhi/testnet');

console.log('Building regtets UI...');
exec('npm run build:regtest --output=/var/www/bodhi/regtest');
