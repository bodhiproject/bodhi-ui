import { observable, action, reaction } from 'mobx';
import moment from 'moment';
import momentDurationFormat from 'moment-duration-format';
import { Routes } from 'constants';

import locales from '../languageProvider';
import { faqUrls } from '../config/app';
import Tracking from '../helpers/mixpanelUtil';

export default class UiStore {
  @observable location = Routes.PREDICTION
  @observable locale = localStorage.getItem('bodhi_dapp_lang') || this.defaultLocale
  @observable searchBarMode = false
  @observable dropdownMenuOpen = false;
  @observable currentTimeUnix = 0;
  @observable favoriteDrawerOpen = false;
  counterInterval = null;

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

    // For eventcard countdown
    this.counterInterval = setInterval(() => this.currentTimeUnix = moment().unix());

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
  showFavoriteDrawer = () => this.favoriteDrawerOpen = true;

  @action
  hideFavoriteDrawer = () => this.favoriteDrawerOpen = false;

  @action
  enableSearchBarMode = () => {
    this.hideFavoriteDrawer();
    this.searchBarMode = true;
    document.body.style.overflow = 'hidden';
    document.getElementById('searchEventInput').focus();
  }

  @action
  disableSearchBarMode = () => {
    this.searchBarMode = false;
    document.body.style.overflow = null;
  }

  @action
  toggleDropdownMenu = () => this.dropdownMenuOpen = !this.dropdownMenuOpen

  @action
  onHelpButtonClick = () => {
    window.open(faqUrls[this.locale], '_blank');
    Tracking.track('navBar-helpClick');
    this.toggleDropdownMenu();
  }
}
