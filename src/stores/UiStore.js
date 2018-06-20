import { observable, action, reaction } from 'mobx';
import moment from 'moment';
import locales from '../languageProvider';
import { AppLocation } from '../constants';


export default class UiStore {
  @observable location = AppLocation.qtumPrediction
  @observable locale = localStorage.getItem('lang') || this.defaultLocale
  get localeMessages() {
    return locales[this.locale].messages;
  }
  get defaultLocale() {
    let locale = navigator.language || navigator.userLanguage || '';
    if (locale.startsWith('en')) {
      locale = 'en-US';
    } else if (locale.startsWith('zh')) {
      locale = 'zh-Hans-CN';
    } else if (locale.startsWith('ko')) {
      locale = 'ko-KR';
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

  @action.bound
  changeLocale(newLocale) {
    this.locale = locales[newLocale].locale;
  }
}
