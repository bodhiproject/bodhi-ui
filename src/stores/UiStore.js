import { observable, action, reaction, computed } from 'mobx';
import moment from 'moment';
import locales from '../languageProvider';


export default class UIStore {
  @observable locale = localStorage.getItem('lang') || this.defaultLocale
  @computed get localeMessages() {
    return locales[this.locale].messages;
  }
  @computed get defaultLocale() {
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
    // this.locale = this.locale === 'en-US' ? locales['zh-Hans-CN'].locale : locales['en-US'].locale;
  }
}
