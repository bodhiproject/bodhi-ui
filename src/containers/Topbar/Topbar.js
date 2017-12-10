import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout, Menu, Dropdown, Icon, message } from 'antd';

import appActions from '../../redux/app/actions';
import TopbarWrapper from './topbar.style';
import { TopbarSearch } from '../../components/topbar';
import { getCurrentTheme } from '../ThemeSwitcher/config';
import { themeConfig } from '../../config';

const { Header } = Layout;
const { toggleCollapsed } = appActions;


class Topbar extends React.PureComponent {
  onClick({ key }) {
    message.info(`Click on item ${key}`);
  }

  render() {
    const { toggle } = this.props;
    const customizedTheme = getCurrentTheme('topbarTheme', themeConfig.theme);
    const collapsed = this.props.collapsed && !this.props.openDrawer;

    const menu = (
      <Menu onClick={this.onClick}>
        <Menu.Item key="1">1st address</Menu.Item>
        <Menu.Item key="2">2nd address</Menu.Item>
        <Menu.Item key="3">3rd address</Menu.Item>
      </Menu>
    );

    return (
      <TopbarWrapper>
        <Header
          style={{
            background: customizedTheme.backgroundColor,
          }}
          className={
            collapsed ? 'collapsed' : ''
          }
        >
          <div className="horizontalWrapper">
            <div className="topbarWrapper">
              <div className="isoLeft">
                <div className="isoSearch">
                  <TopbarSearch customizedTheme={customizedTheme} />
                </div>
              </div>

              <ul className="isoRight">
                <li><Link to="/" >Events</Link></li>
                <li><Link to="/create-topic" >Create an Event</Link></li>
                <li><Dropdown overlay={menu}>
                  <a className="ant-dropdown-link" href="#">0x39...9876<Icon type="down" />
                  </a>
                </Dropdown></li>
              </ul>
            </div>
          </div>
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
