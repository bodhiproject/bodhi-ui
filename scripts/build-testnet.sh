#!/bin/sh
# should be run from root folder
sudo mkdir -p /var/www/bodhi/testnet
node scripts/build-testnet.js
