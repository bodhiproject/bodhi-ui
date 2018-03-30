import appLocaleData from 'react-intl/locale-data/zh';
import 'moment/locale/zh-cn';
import zhMessages from '../locales/zh-Hans.json';

const ZhLan = {
  messages: {
    ...zhMessages,
  },
  locale: 'zh-Hans-CN',
  data: appLocaleData,
  momentlocale: 'zh-cn',
};
export default ZhLan;
