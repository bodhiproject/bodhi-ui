const { split } = require('lodash');

// Set chain env vars.
// The --chain flag must be defined and one of: mainnet, testnet, regtest
let chain;
process.argv.forEach((arg) => {
  if (arg.startsWith('--chain=')) {
    chain = (split(arg, '=', 2))[1];
    if (!['mainnet', 'testnet', 'regtest'].some(item => item === chain)) {
      throw Error('--chain= flag must be one of: mainnet, testnet, regtest');
    }

    let hostname;
    let apiPort;
    switch (chain) {
      case 'mainnet': {
        hostname = 'puti.io';
        apiPort = 8989;
        break;
      }
      case 'testnet': {
        hostname = 'dev.puti.io';
        apiPort = 6767;
        break;
      }
      case 'regtest': {
        hostname = 'test.puti.io';
        apiPort = 5555;
        break;
      }
      default: {
        throw Error(`Invalid chain type: ${chain}`);
      }
    }
    process.env.CHAIN_NETWORK = chain;
    process.env.API_HOSTNAME = hostname;
    process.env.API_PORT = apiPort;
  }
});
if (!chain) {
  throw Error('--chain= flag must be one of: mainnet, testnet, regtest');
}

// Set network protocol env vars
process.env.PROTOCOL_HTTP = process.env.PROTOCOL_HTTP || 'https';
process.env.PROTOCOL_WS = process.env.PROTOCOL_WS || 'wss';

// Check for --localwallet flag.
// The localwallet flag lets the UI know that it is using a local wallet (Qtum wallet) to handle transactions.
// Default logic is to use Naka Wallet for transactions.
process.env.LOCAL_WALLET = process.argv.includes('--localwallet') ? true : false;

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('../config/webpack.config.prod');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const useYarn = fs.existsSync(paths.yarnLockFile);

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.
measureFileSizesBeforeBuild(paths.appBuild)
  .then((previousFileSizes) => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild);
    // Merge with the public folder
    copyPublicFolder();
    // Start the webpack build
    return build(previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(`\nSearch for the ${
          chalk.underline(chalk.yellow('keywords'))
        } to learn more about each warning.`);
        console.log(`To ignore, add ${
          chalk.cyan('// eslint-disable-next-line')
        } to the line before.\n`);
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );
      console.log();

      const appPackage = require(paths.appPackageJson);
      const publicUrl = paths.publicUrl;
      const publicPath = config.output.publicPath;
      const buildFolder = path.relative(process.cwd(), paths.appBuild);
      printHostingInstructions(
        appPackage,
        publicUrl,
        publicPath,
        buildFolder,
        useYarn
      );
    },
    (err) => {
      console.log(chalk.red('Failed to compile.\n'));
      console.log(`${err.message || err}\n`);
      process.exit(1);
    }
  );

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
  console.log('Creating an optimized production build...');

  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }
      const messages = formatWebpackMessages(stats.toJson({}, true));
      if (messages.errors.length) {
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(chalk.yellow('\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'));
        return reject(new Error(messages.warnings.join('\n\n')));
      }
      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      });
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: (file) => file !== paths.appHtml,
  });
}
