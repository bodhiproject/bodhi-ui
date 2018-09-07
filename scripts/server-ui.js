const { execSync } = require('child_process');

const pipeLogs = (process) => {
  process.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  process.stderr.on('data', (data) => {
    console.log(data.toString());
  });
};

console.log('Building mainnet UI...');
let process = execSync('npm run build:mainnet --output=/var/www/bodhi/mainnet');
pipeLogs(process);

console.log('Building testnet UI...');
process = execSync('npm run build:testnet --output=/var/www/bodhi/testnet');
pipeLogs(process);

console.log('Building regtets UI...');
process = execSync('npm run build:regtest --output=/var/www/bodhi/regtest');
pipeLogs(process);
