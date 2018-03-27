import React from 'react';
import { IntlProvider } from 'react-intl';

export function i18nToUpperCase(txt) {
  return (<span>
    {txt.toUpperCase()}
  </span>);
}

let intlProvider;
let i18nIntl;
export function getIntlProvider(locale = 'en', localeMessages) {
  if (!i18nIntl) {
    intlProvider = new IntlProvider({ locale, messages: localeMessages }, {});
    const { intl } = intlProvider.getChildContext();
    i18nIntl = intl;
  } else {
    const { locale: prev } = intlProvider.props;
    if (prev !== locale) {
      intlProvider = new IntlProvider({ locale, messages: localeMessages }, {});
      const { intl } = intlProvider.getChildContext();
      i18nIntl = intl;
    }
  }
  return i18nIntl;
}
