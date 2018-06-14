import { addLocaleData } from 'react-intl';
import Enlang from './entries/en-US';
import Zhlang from './entries/zh-Hans-CN';
import Krlang from './entries/ko-KR';

addLocaleData(Enlang.data);
addLocaleData(Zhlang.data);
addLocaleData(Krlang.data);

export default {
  [Enlang.locale]: Enlang,
  [Zhlang.locale]: Zhlang,
  [Krlang.locale]: Krlang,
};
