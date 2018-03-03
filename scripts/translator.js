/* eslint-disable */
import * as fs from 'fs';
import { sync as globSync } from 'glob';
import { sync as mkdirpSync } from 'mkdirp';

const filePattern = './build/messages/**/*.json';
const outputLanguageDataDir = './src/languageProvider/locales/';

let prevmessages = JSON.parse(fs.readFileSync('./src/languageProvider/locales/en_US.json', 'utf8'));
let cnMessages = JSON.parse(fs.readFileSync('./src/languageProvider/locales/zh-Hans.json', 'utf8'));
// Aggregates the default messages that were extracted from the app's
// React components via the React Intl Babel plugin. The result
// is a flat collection of `id: message` pairs for the app's default locale.
let cnNew = {};
let defaultMessages = globSync(filePattern)
  .map((filename) => fs.readFileSync(filename, 'utf8'))
  .map((file) => JSON.parse(file))
  .reduce((collection, descriptors) => {
    descriptors.forEach(({ id, defaultMessage }) => {
      collection[id] = defaultMessage;
      cnNew[id] = defaultMessage;
      if(prevmessages.hasOwnProperty(id)){
        if(collection[id]!==prevmessages[id]){
          cnNew[id] = defaultMessage;
        }else{
          cnNew[id] = cnMessages[id];
        }
      }
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
cnNew = sortObjectKeys(cnNew);
fs.writeFileSync(outputLanguageDataDir + 'en_US.json', `${JSON.stringify(defaultMessages, null, 2)}\n`);
fs.writeFileSync(outputLanguageDataDir + 'zh-Hans.json', `${JSON.stringify(cnNew, null, 2)}\n`);
