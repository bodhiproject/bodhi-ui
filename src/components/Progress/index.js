import { Progress } from 'antd';
import AntProgress from './styles';
import WithDirection from '../../config/withDirection';

const WDProgress = AntProgress(Progress);
const isoProgress = WithDirection(WDProgress);

export default isoProgress;
