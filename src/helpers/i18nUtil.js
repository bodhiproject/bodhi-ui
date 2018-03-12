import React from 'react';
import { IntlProvider } from 'react-intl';
export function i18nToUpperCase(txt) {
  return (<span>
    {txt.toUpperCase()}
  </span>);
}

export function getIntlProvider(locale, localeMessages) {
  const intlProvider = new IntlProvider({ locale, messages: localeMessages }, {});
  const { intl } = intlProvider.getChildContext();
  return intl;
}
