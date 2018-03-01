// translationRunner.js
const manageTranslations = require('react-intl-translations-manager').default;
 
// es2015 import
// import manageTranslations from 'react-intl-translations-manager';
 
manageTranslations({
  messagesDirectory: '../build/messages',
  translationsDirectory: '../src/languageProvider/locales/',
  languages: ['en_US','zh-Hans'], // any language you need
  detectDuplicateIds: false,
});