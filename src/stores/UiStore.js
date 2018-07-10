import { observable, action, reaction } from 'mobx';
import moment from 'moment';
import { AppLocation } from 'constants';
import locales from '../languageProvider';


export default class UiStore {
  @observable location = AppLocation.QTUM_PREDICTION
  @observable locale = localStorage.getItem('lang') || this.defaultLocale
  @observable error = null

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
        localStorage.setItem('lang', this.locale);
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
