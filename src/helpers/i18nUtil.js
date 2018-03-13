import React from 'react';
import { IntlProvider } from 'react-intl';
export function i18nToUpperCase(txt) {
  return (<span>
    {txt.toUpperCase()}
  </span>);
}

let intlProvider;
export function getIntlProvider(locale, localeMessages) {
  if (!intlProvider) {
    intlProvider = new IntlProvider({ locale, messages: localeMessages }, {});
  } else {
    const { locale: prev } = intlProvider.props;
    if (prev !== locale) {
      intlProvider = new IntlProvider({ locale, messages: localeMessages }, {});
    }
  }
  const { intl } = intlProvider.getChildContext();
  return intl;
}
