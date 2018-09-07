const { execSync } = require('child_process');

const runProcess = (cmd) => {
  execSync(cmd, [], function(err, stdout, stderr) {
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    if (err) console.error(err);
  });
};

console.log('Building mainnet UI...');
runProcess('npm run build:mainnet --output=/var/www/bodhi/mainnet');

console.log('Building testnet UI...');
runProcess('npm run build:testnet --output=/var/www/bodhi/testnet');

console.log('Building regtets UI...');
runProcess('npm run build:regtest --output=/var/www/bodhi/regtest');
