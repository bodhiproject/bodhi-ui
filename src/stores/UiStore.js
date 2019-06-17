import { observable, action, reaction, computed } from 'mobx';
import moment from 'moment';
import momentDurationFormat from 'moment-duration-format';
import { Routes } from 'constants';
import { STORAGE_KEY, faqUrls } from '../config/app';
import locales from '../languageProvider';
import Tracking from '../helpers/mixpanelUtil';

export default class UiStore {
  @observable location = Routes.PREDICTION
  @observable locale = localStorage.getItem(STORAGE_KEY.LOCALE) || this.defaultLocale
  @observable searchBarMode = false
  @observable dropdownMenuOpen = false;
  @observable currentTimeUnix = 0;
  @observable noWalletDialogVisible = false;
  counterInterval = null;
  historyNeedUpdate = false; // for after create event, history gets init, and know need to pull for new create event tx

  get localeMessages() {
    return locales[this.locale].messages;
  }

  get defaultLocale() {
    let locale = navigator.language || navigator.userLanguage || '';
    if (locale.startsWith('en')) {
      locale = 'en-US';
    } else if (locale.startsWith('ko')) {
      locale = 'ko-KR';
    } else { // Default lang is zh-Hans-CN
      locale = 'zh-Hans-CN';
    }
    return locale;
  }

  @computed get ifHistoryNeedUpdate() {
    return this.historyNeedUpdate;
  }

  constructor(app) {
    this.app = app;

    // For eventcard countdown
    this.counterInterval = setInterval(() => this.currentTimeUnix = moment().unix());

    // Extend Moment with DurationFormat here to avoid overwritting of the moment locale
    momentDurationFormat(moment);
    moment.updateLocale('en', {
      longDateFormat: {
        LL: 'MMM Do, H:mm',
        LLL: 'M/D/YY H:mm',
        LLLL: 'MMM Do, YYYY, H:mm',
      },
    });
    moment.updateLocale('ko', {
      longDateFormat: {
        LL: 'M월D일 H:mm',
        LLL: 'YY/M/D H:mm',
        LLLL: 'YYYY년 M월D일 H:mm',
      },
    });
    moment.updateLocale('zh-cn', {
      longDateFormat: {
        LL: 'M月D日 H:mm',
        LLL: 'YY/M/D H:mm:ss',
        LLLL: 'YYYY年M月D日 H:mm',
      },
    });

    reaction( // whenever the locale changes, update locale in local storage and moment
      () => this.locale,
      () => {
        moment.locale(locales[this.locale].momentlocale);
        localStorage.setItem(STORAGE_KEY.LOCALE, this.locale);
      },
      { fireImmediately: true }
    );
  }

  getMomentLocale = () => moment.locale();

  @action
  toggleHistoryNeedUpdate = () => {
    this.historyNeedUpdate = !this.historyNeedUpdate;
  }

  // this setter is only here so we don't have to import `locales` into other files
  @action
  changeLocale = (newLocale) => {
    this.locale = locales[newLocale].locale;
  }

  @action
  enableSearchBarMode = () => {
    this.searchBarMode = true;
    this.dropdownMenuOpen = false;
    document.body.style.overflow = 'hidden';
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

  @action
  showNoWalletDialog = () => {
    this.noWalletDialogVisible = true;
  }

  @action
  hideNoWalletDialog = () => {
    this.noWalletDialogVisible = false;
  }
}
