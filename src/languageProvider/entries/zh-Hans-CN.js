import antdZh from 'antd/lib/locale-provider/zh_TW';
import appLocaleData from 'react-intl/locale-data/zh';
import zhMessages from '../locales/zh-Hans.json';

const ZhLan = {
  messages: {
    ...zhMessages,
  },
  antd: antdZh,
  locale: 'zh-Hans-CN',
  data: appLocaleData,
};
export default ZhLan;
