/* eslint-disable */
import * as fs from 'fs';
import { sync as globSync } from 'glob';
import { sync as mkdirpSync } from 'mkdirp';

const filePattern = './build/messages/**/*.json';
const outputLanguageDataDir = './src/languageProvider/locales/';

// Aggregates the default messages that were extracted from the app's
// React components via the React Intl Babel plugin. The result
// is a flat collection of `id: message` pairs for the app's default locale.
let defaultMessages = globSync(filePattern)
  .map((filename) => fs.readFileSync(filename, 'utf8'))
  .map((file) => JSON.parse(file))
  .reduce((collection, descriptors) => {
    descriptors.forEach(({ id, defaultMessage }) => {
      collection[id] = defaultMessage;
    });
    return collection;
  }, {});

function sortObjectKeys(obj){
  return Object.keys(obj).sort().reduce((acc,key)=>{
      acc[key]=obj[key];
      return acc;
  },{});
}

mkdirpSync(outputLanguageDataDir);
defaultMessages = sortObjectKeys(defaultMessages);
fs.writeFileSync(outputLanguageDataDir + 'en_US.json', `${JSON.stringify(defaultMessages, null, 2)}`);