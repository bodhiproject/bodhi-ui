import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Layout, Menu, Dropdown, Icon, message, Button, Modal, Form, Input } from 'antd';

import appActions from '../../redux/app/actions';
import TopbarWrapper from './topbar.style';
import { TopbarSearch } from '../../components/topbar';
import { getCurrentTheme } from '../ThemeSwitcher/config';
import { themeConfig } from '../../config';

const FormItem = Form.Item;
const { Header } = Layout;
const addressMaxDisplayLength = 11;
const KEY_ADD_ADDRESS_BTN = 'add_address';

function shortenAddress(text, maxLength) {
  let ret = text;

  const startLen = (maxLength - 3) / 2;
  const endLen = (maxLength - 3) / 2;

  if (ret.length > maxLength) {
    ret = `${ret.substr(0, startLen)} ... ${ret.substr(ret.length - endLen)}`;
  }

  return ret;
}

class Topbar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      addressInput: '',
    };

    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onAddressInputChange = this.onAddressInputChange.bind(this);
    this.onDropdownClick = this.onDropdownClick.bind(this);
  }

  onDropdownClick({ key, item }) {
    if (key === KEY_ADD_ADDRESS_BTN) {
      this.showModal();
    } else {
      this.props.selectWalletAddress(item.props.index);
    }
  }

  onAddressInputChange(e) {
    this.setState({
      addressInput: e.target.value,
    });
  }

  handleOk(e) {
    // Push this.state.addressInput to state.App
    this.props.addWalletAddress(this.state.addressInput);

    // Clear input fields
    this.setState({
      visible: false,
      addressInput: '',
    });
  }

  showModal() {
    this.setState({
      visible: true,
    });
  }

  handleCancel(e) {
    this.setState({
      visible: false,
      addressInput: '',
    });
  }

  // handleSubmit(e) {
  //   e.preventDefault();

  //   console.log(this.state.addressInput);
  //   this.props.addWalletAddress(this.state.addressInput);
  // }

  render() {
    const { toggle, walletAddrs, walletAddrsIndex } = this.props;
    const customizedTheme = getCurrentTheme('topbarTheme', themeConfig.theme);
    const collapsed = this.props.collapsed && !this.props.openDrawer;

    const menu = (
      <Menu onClick={this.onDropdownClick}>
        {_.map(walletAddrs, (addr, index) => <Menu.Item key={addr} index={index}>{addr}</Menu.Item>)}
        <Menu.Item key={KEY_ADD_ADDRESS_BTN}>Add address</Menu.Item>
      </Menu>
    );

    const walletAddrsEle = (_.isEmpty(walletAddrs)) ?
      (<Link to="#" onClick={this.showModal}>
        <Icon type="plus" />Add account
      </Link>)
      :
      (<Dropdown overlay={menu}>
        <a className="ant-dropdown-link" href="#">{shortenAddress(walletAddrs[walletAddrsIndex], addressMaxDisplayLength)}<Icon type="down" />
        </a>
      </Dropdown>);

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
          <div className="cancel-ant-layout-header">
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
                  <li>{walletAddrsEle}</li>
                </ul>
              </div>
            </div>
          </div>
        </Header>
        <Modal
          title="Add account"
          okText="Add associated address"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <h3>Address</h3>
          <Form className="form-add-address">
            <FormItem>
              <Input placeholder="Address" value={this.state.addressInput} onChange={this.onAddressInputChange} />
            </FormItem>
          </Form>
        </Modal>
      </TopbarWrapper>
    );
  }
}

Topbar.propTypes = {
  toggle: PropTypes.func.isRequired,
  collapsed: PropTypes.bool.isRequired,
  openDrawer: PropTypes.bool.isRequired,
  walletAddrs: PropTypes.array,
  walletAddrsIndex: PropTypes.number,
  addWalletAddress: PropTypes.func,
  selectWalletAddress: PropTypes.func,
};

Topbar.defaultProps = {
  walletAddrs: [],
  walletAddrsIndex: 0,
  addWalletAddress: undefined,
  selectWalletAddress: undefined,
  // form: undefined,
};

const mapStateToProps = (state) => ({
  ...state.App.toJS(),
  walletAddrs: state.App.get('walletAddrs'),
  walletAddrsIndex: state.App.get('walletAddrsIndex'),
});

const mapDispatchToProps = (dispatch) => ({
  toggle: appActions.toggleCollapsed,
  addWalletAddress: (value) => dispatch(appActions.addWalletAddress(value)),
  selectWalletAddress: (value) => dispatch(appActions.selectWalletAddress(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Topbar);
