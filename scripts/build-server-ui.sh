#!/bin/sh

echo 'Building mainnet UI at /var/www/bodhi/mainnet'
yarn build --chain=mainnet --output=/var/www/bodhi/mainnet

echo 'Building testnet UI at /var/www/bodhi/testnet'
yarn build --chain=testnet --output=/var/www/bodhi/testnet

echo 'Building regtest UI at /var/www/bodhi/regtest'
yarn build --chain=regtest --output=/var/www/bodhi/regtest
