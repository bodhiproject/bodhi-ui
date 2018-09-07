#!/bin/sh

echo 'Building mainnet UI at /var/www/bodhi/mainnet'
yarn build:mainnet --output=/var/www/bodhi/mainnet

echo 'Building testnet UI at /var/www/bodhi/testnet'
yarn build:testnet --output=/var/www/bodhi/testnet

echo 'Building regtest UI at /var/www/bodhi/regtest'
yarn build:regtest --output=/var/www/bodhi/regtest
