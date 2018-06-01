import { addLocaleData } from 'react-intl';
import Enlang from './entries/en-US';
import Zhlang from './entries/zh-Hans-CN';
import Krlang from './entries/ko-KR';
const AppLocale = {
  en: Enlang,
  zh: Zhlang,
  kr: Krlang,
};
addLocaleData(AppLocale.en.data);
addLocaleData(AppLocale.zh.data);
addLocaleData(AppLocale.kr.data);
export default AppLocale;
