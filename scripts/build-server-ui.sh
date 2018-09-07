#!/bin/sh

echo 'Building mainnet UI at /var/www/bodhi/mainnet'
sudo npm run build:mainnet --output=/var/www/bodhi/mainnet

echo 'Building testnet UI at /var/www/bodhi/testnet'
sudo npm run build:testnet --output=/var/www/bodhi/testnet

echo 'Building regtest UI at /var/www/bodhi/regtest'
sudo npm run build:regtest --output=/var/www/bodhi/regtest
