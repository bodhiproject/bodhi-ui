const { execSync } = require('child_process');

const runProcess = (env) => {
  const path = `/var/www/bodhi/${env}`;
  console.log(`Building ${env} UI at ${path}`);
  execSync(`npm run build:${env} --output=${path}`, {
    stdio: 'inherit',
    shell: true,
  });
};

runProcess('mainnet');
runProcess('testnet');
runProcess('regtest');
