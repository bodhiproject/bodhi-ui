const { execSync } = require('child_process');

const runProcess = (env) => {
  const cmd = `npm run build:${env}`;
  const path = `/var/www/bodhi/${env}`;

  console.log(`Building ${env} UI at ${path}`);
  execSync(cmd, [`--output=${path}`], function(err, stdout, stderr) {
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    if (err) console.error(err);
  });
};

runProcess('mainnet');
runProcess('testnet');
runProcess('regtest');
