import { observable, action, reaction } from 'mobx';
import moment from 'moment';
import { Routes } from 'constants';
import locales from '../languageProvider';

export default class UiStore {
  @observable location = Routes.QTUM_PREDICTION
  @observable locale = localStorage.getItem('bodhi_dapp_lang') || this.defaultLocale
  @observable error = null
  @observable searchBarMode = false

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

  constructor() {
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
  setError = (message, route) => {
    this.error = { message, route };
  }

  @action
  clearError = () => {
    this.error = null;
  }
}
