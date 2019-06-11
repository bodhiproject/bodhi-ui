#!/bin/sh
# Script should be run from root folder

DEPLOY_PATH=/var/www/bodhi/testnet/

echo "Building Testnet UI..."
node scripts/deploy-testnet.js

echo "Creating output path..."
sudo mkdir -p $DEPLOY_PATH

echo "Copying build folder to output path..."
sudo cp -a build/. $DEPLOY_PATH
