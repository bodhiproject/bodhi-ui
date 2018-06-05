import appLocaleData from 'react-intl/locale-data/ko';
import 'moment/locale/ko';
import KrMessages from '../locales/ko-KR.json';

const KrLang = {
  messages: {
    ...KrMessages,
  },
  locale: 'ko-KR',
  data: appLocaleData,
  momentlocale: 'ko',
};
export default KrLang;
