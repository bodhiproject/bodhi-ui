import { observable, action, reaction } from 'mobx';
import moment from 'moment';
import { Routes } from 'constants';
import locales from '../languageProvider';

export default class UiStore {
  @observable location = Routes.QTUM_PREDICTION
  @observable locale = localStorage.getItem('bodhi_dapp_lang') || this.defaultLocale
  @observable error = null
  @observable globalMessage = null
  @observable searchBarMode = false
  @observable dropdownDirection = 'down'

  get localeMessages() {
    return locales[this.locale].messages;
  }

  get defaultLocale() {
    let locale = navigator.language || navigator.userLanguage || '';
    if (locale.startsWith('ko')) {
      locale = 'ko-KR';
    } else if (locale.startsWith('zh')) {
      locale = 'zh-Hans-CN';
    } else { // Location Other than ko and zh will now return en-US
      locale = 'en-US';
    }
    return locale;
  }

  constructor(app) {
    this.app = app;
    reaction( // whenever the locale changes, update locale in local storage and moment
      () => this.locale,
      () => {
        moment.locale(locales[this.locale].momentlocale);
        localStorage.setItem('bodhi_dapp_lang', this.locale);
      },
      { fireImmediately: true }
    );
  }

  @action // this setter is only here so we don't have to import `locales` into other files
  changeLocale = (newLocale) => {
    this.locale = locales[newLocale].locale;
  }

  @action
  setError = (message, additionalMessage) => {
    this.globalMessage = { title: { id: 'str.error', defaultMessage: 'Error' }, message, additionalMessage, messageType: 'ERROR' };
  }

  @action
  setGlobalMessage = (title, message, additionalMessage, messageType = 'ERROR') => {
    this.globalMessage = { title, message, additionalMessage, messageType };
  }

  @action
  clearGlobalMessage = () => {
    this.globalMessage = null;
  }

  @action
  enableSearchBarMode = () => {
    this.searchBarMode = true;
    document.body.style.overflow = 'hidden';
    document.getElementById('searchEventInput').focus();
    this.dropdownDirection = 'down';
  }

  @action
  disableSearchBarMode = () => {
    this.searchBarMode = false;
    document.body.style.overflow = null;
  }
}
