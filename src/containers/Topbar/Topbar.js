import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import appActions from '../../redux/app/actions';
import TopbarWrapper from './topbar.style';
import TopbarUser from '../../components/topbar/topbarUser';
import { getCurrentTheme } from '../ThemeSwitcher/config';
import { themeConfig } from '../../config';

const { Header } = Layout;
const { toggleCollapsed } = appActions;

class Topbar extends React.Component {
  render() {
    const { toggle } = this.props;
    const customizedTheme = getCurrentTheme('topbarTheme', themeConfig.theme);
    const collapsed = this.props.collapsed && !this.props.openDrawer;
    const styling = {
      background: customizedTheme.backgroundColor,
      position: 'fixed',
      width: '100%',
      height: 70,
    };
    return (
      <TopbarWrapper>
        <Header
          style={styling}
          className={
            collapsed ? 'isomorphicTopbar collapsed' : 'isomorphicTopbar'
          }
        >
          <div className="isoLeft">
            <button
              className={
                collapsed ? 'triggerBtn menuCollapsed' : 'triggerBtn menuOpen'
              }
              style={{ color: customizedTheme.textColor }}
              onClick={toggle}
            />
          </div>

          <ul className="isoRight">
            <li
              className="isoUser"
            >
              <TopbarUser />
            </li>
          </ul>
        </Header>
      </TopbarWrapper>
    );
  }
}

Topbar.propTypes = {
  toggle: PropTypes.func.isRequired,
  collapsed: PropTypes.bool.isRequired,
  openDrawer: PropTypes.bool.isRequired,
};

export default connect(
  (state) => ({
    ...state.App.toJS(),
  }),
  { toggle: toggleCollapsed }
)(Topbar);
