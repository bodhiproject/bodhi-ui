import appLocaleData from 'react-intl/locale-data/ko';
import 'moment/locale/ko';
import KrMessages from '../locales/ko-KR.json';

const KrLan = {
  messages: {
    ...KrMessages,
  },
  locale: 'zh-Hans-CN',
  data: appLocaleData,
  momentlocale: 'zh-cn',
};
export default KrLan;
