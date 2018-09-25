import { observable, action, reaction } from 'mobx';
import moment from 'moment';
import momentDurationFormat from 'moment-duration-format';
import { Routes } from 'constants';
import locales from '../languageProvider';

export default class UiStore {
  @observable location = Routes.QTUM_PREDICTION
  @observable locale = localStorage.getItem('bodhi_dapp_lang') || this.defaultLocale
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

    // Extend Moment with DurationFormat here to avoid overwritting of the moment locale
    momentDurationFormat(moment);
    moment.updateLocale('en', {
      longDateFormat: {
        LLL: 'M/D/YY H:mm:ss',
        LLLL: 'MMM Do, YYYY H:mm:ss',
      },
    });
    moment.updateLocale('ko', {
      longDateFormat: {
        LLL: 'YY/M/D H:mm:ss',
        LLLL: 'YYYY년 M월D일 H:mm:ss',
      },
    });
    moment.updateLocale('zh-cn', {
      longDateFormat: {
        LLL: 'YY/M/D H:mm:ss',
        LLLL: 'YYYY年M月D日 H:mm:ss',
      },
    });

    reaction( // whenever the locale changes, update locale in local storage and moment
      () => this.locale,
      () => {
        moment.locale(locales[this.locale].momentlocale);
        localStorage.setItem('bodhi_dapp_lang', this.locale);
      },
      { fireImmediately: true }
    );
  }

  getMomentLocale = () => moment.locale();

  // this setter is only here so we don't have to import `locales` into other files
  @action
  changeLocale = (newLocale) => {
    this.locale = locales[newLocale].locale;
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
