import { addLocaleData } from 'react-intl';
import Enlang from './entries/en-US';
import Zhlang from './entries/zh-Hans-CN';

const AppLocale = {
  en: Enlang,
  zh: Zhlang,
};
addLocaleData(AppLocale.en.data);
addLocaleData(AppLocale.zh.data);

export default AppLocale;
