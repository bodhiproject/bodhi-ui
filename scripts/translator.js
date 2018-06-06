/* eslint-disable */
import * as fs from 'fs-extra';
import { sync as globSync } from 'glob';
import { sync as mkdirpSync } from 'mkdirp';

const filePattern = './build/messages/**/*.json';
const outputLanguageDataDir = './src/languageProvider/locales/';

let prevmessages = JSON.parse(fs.readFileSync('./src/languageProvider/locales/en_US.json', 'utf8'));
let cnMessages = JSON.parse(fs.readFileSync('./src/languageProvider/locales/zh-Hans.json', 'utf8'));
let krMessages = JSON.parse(fs.readFileSync('./src/languageProvider/locales/ko-KR.json', 'utf8'));

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

function update(obj){
  Object.keys(obj).forEach((key) => {
    if(prevmessages.hasOwnProperty(key)){
      if(obj[key]!==prevmessages[key]){
        cnMessages[key] = obj[key];
        prevmessages[key] = obj[key];
        krMessages[key] = obj[key];
      }
    } else{
      cnMessages[key] = obj[key];
      prevmessages[key] = obj[key];
      krMessages[key] = obj[key];
    }
  });
  Object.keys(prevmessages).forEach((key) => {
    if(!cnMessages.hasOwnProperty(key)){
      cnMessages[key] = prevmessages[key];
    }
    if(!krMessages.hasOwnProperty(key)){
      krMessages[key] = prevmessages[key];
    }
  });
}

function sortObjectKeys(obj){
  return Object.keys(obj).sort().reduce((acc,key)=>{
      acc[key]=obj[key];
      return acc;
  },{});
}


mkdirpSync(outputLanguageDataDir);
update(defaultMessages);
prevmessages = sortObjectKeys(prevmessages);
cnMessages = sortObjectKeys(cnMessages);
krMessages = sortObjectKeys(krMessages);

fs.writeFileSync(outputLanguageDataDir + 'en_US.json', `${JSON.stringify(prevmessages, null, 2)}\n`);
fs.writeFileSync(outputLanguageDataDir + 'zh-Hans.json', `${JSON.stringify(cnMessages, null, 2)}\n`);
fs.writeFileSync(outputLanguageDataDir + 'ko-KR.json', `${JSON.stringify(krMessages, null, 2)}\n`);
fs.removeSync('./build/messages/')
