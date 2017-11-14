import { Tabs } from 'antd';
// import '../../style/UI-Component/tab/tab.css';
import AntTab from './styles/tab.style';
import WithDirection from '../../config/withDirection';

const WDTabs = AntTab(Tabs);
const TabPane = Tabs.TabPane;
const isoTabs = WithDirection(WDTabs);

export default isoTabs;
export { TabPane };
