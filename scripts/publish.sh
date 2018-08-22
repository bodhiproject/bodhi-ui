#!/bin/bash

echo 'Rebuilding build files...'
rm -rf build
npm run build

echo 'Publishing on NPM...'
npm publish
