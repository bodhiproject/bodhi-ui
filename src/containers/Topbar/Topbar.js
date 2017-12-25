import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Layout, Menu, Dropdown, Icon, message, Button, Modal, Form, Input, Row, Col, Tag } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import appActions from '../../redux/app/actions';
import TopbarWrapper from './topbar.style';
import { TopbarSearch } from '../../components/topbar';
import { getCurrentTheme } from '../ThemeSwitcher/config';
import { themeConfig } from '../../config';

const FormItem = Form.Item;
const { Header } = Layout;
const DROPDOWN_LIST_MAX_LENGTH = 8;
const ADDRESS_TEXT_MAX_LENGTH = 11;
const KEY_ADD_ADDRESS_BTN = 'add_address';
const POOL_INTERVAL = 30000;
const MINIMAL_GAS_FEE = 0.1;

/**
 * Utility func to convert address into format of  "Qjsb ... 3dkb"
 * @param  {string} text      Origin address
 * @param  {number} maxLength Length of output string, including 3 dots
 * @return {string} string in format "Qjsb ... 3dkb", or empty string "" if input is undefined or empty
 */
function shortenAddress(text, maxLength) {
  if (!text) {
    return '';
  }

  const cutoffLength = (maxLength - 3) / 2;
  return text.length > maxLength
    ? `${text.substr(0, cutoffLength)} ... ${text.substr(text.length - cutoffLength)}`
    : text;
}

class DropdownMenuItem extends React.Component {
  render() {
    const { onCopyClick, walletAddrs, index } = this.props;

    const address = (walletAddrs && walletAddrs[index] && walletAddrs[index].address) || '';
    const qtum = (walletAddrs && walletAddrs[index] && walletAddrs[index].qtum) || 0;
    const bot = (walletAddrs && walletAddrs[index] && walletAddrs[index].bot) || 0;

    const style = {
      paddingLeft: 32,
      paddingRight: 32,
      paddingTop: 16,
      paddingBottom: 16,
      fontSize: 16,
    };

    return (
      <Row type="flex" justify="space-between" align="middle" gutter={16} style={style}>
        <Col>
          <span>{address}</span>
        </Col>
        <Col>
          <Tag >{qtum.toFixed(2)}</Tag>
        </Col>
        <Col>
          <Tag>{bot.toFixed(2)}</Tag>
        </Col>
        <Col>
          <CopyToClipboard text={address} onCopy={onCopyClick} >
            <Button onClick={(evt) => evt.stopPropagation()}>
              <Icon type="copy" /> Copy
            </Button>
          </CopyToClipboard>
        </Col>
      </Row>
    );
  }
}

DropdownMenuItem.propTypes = {
  index: PropTypes.number.isRequired,
  onCopyClick: PropTypes.func.isRequired,
  walletAddrs: PropTypes.array,
};

DropdownMenuItem.defaultProps = {
  walletAddrs: [],
};

const DropdownMenuItemWrapper = connect((state) => ({
  walletAddrs: state.App.get('walletAddrs'),
}), null)(DropdownMenuItem);


class Topbar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      addressInput: '',
    };

    this.showModal = this.showModal.bind(this);
    this.handleAddAccountClicked = this.handleAddAccountClicked.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onAddressInputChange = this.onAddressInputChange.bind(this);
    this.onAddressDropdownClick = this.onAddressDropdownClick.bind(this);
    this.onCopyClicked = this.onCopyClicked.bind(this);
  }

  componentWillMount() {
    const { onGetBlockCount, listUnspent } = this.props;

    (function startPoll() {
      onGetBlockCount();
      listUnspent();
      setTimeout(startPoll, POOL_INTERVAL);
    }());
  }

  componentWillReceiveProps(nextProps) {
    const {
      onGetBlockCount, getBotBalance, selectedWalletAddress,
    } = this.props;

    // Call API to retrieve BOT balance if BOTs does not exist or wallet addresses have changed
    const botArray = _.filter(this.props.walletAddrs, (item) => !!item.bot);

    if (_.isEmpty(botArray) || !_.isEqual(this.props.walletAddrs, nextProps.walletAddrs)) {
      _.each(nextProps.walletAddrs, (addressObj) => {
        const ownerAddress = addressObj.address;
        const senderAddress = addressObj.address;
        getBotBalance(ownerAddress, senderAddress);
      });
    }
  }

  onAddressDropdownClick({ key, item }) {
    if (key === KEY_ADD_ADDRESS_BTN) {
      this.showModal();
    } else {
      message.info(`Primary wallet address set to "${key}".`);
      this.props.selectWalletAddress(item.props.index);
    }
  }

  onAddressInputChange(e) {
    this.setState({
      addressInput: e.target.value,
    });
  }

  onCopyClicked(text) {
    message.info(`Copied address ${text}`);
  }

  handleAddAccountClicked() {
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

  handleCancel() {
    this.setState({
      visible: false,
      addressInput: '',
    });
  }

  render() {
    const customizedTheme = getCurrentTheme('topbarTheme', themeConfig.theme);
    const {
      collapsed, walletAddrs, blockCount, selectedWalletAddress,
    } = this.props;

    const menu = (
      <Menu onClick={this.onAddressDropdownClick}>
        {
          // Build dropdown list using walletAddrs array
          _.map(walletAddrs, (item, index) => (<Menu.Item key={item.address} index={index} style={{ padding: 0, borderBottom: '1px solid #eee' }}>
            <DropdownMenuItemWrapper
              index={index}
              onCopyClick={this.onCopyClicked}
            />
          </Menu.Item>
          ))}
        {/* Add Address button at end of dropdown <Menu.Item
                  key={KEY_ADD_ADDRESS_BTN}
                  style={{
                    padding: '14px 0px', borderBottom: '1px solid #eee', fontSize: '16px', textAlign: 'center',
                  }}
                >Add address</Menu.Item> */}
      </Menu>
    );


    const walletAddrsEle = _.isEmpty(walletAddrs)
      ? (
        <Link to="#" onClick={this.showModal}>
          <Icon type="plus" />Add address
        </Link>
      ) : (
        <Dropdown overlay={menu} placement="bottomRight">
          <a className="ant-dropdown-link" onClick={(evt) => { evt.preventDefault(); }}>
            {selectedWalletAddress ? shortenAddress(selectedWalletAddress, ADDRESS_TEXT_MAX_LENGTH) : null}
            <Icon type="down" />
          </a>
        </Dropdown>
      );

    return (
      <TopbarWrapper>
        <Header
          style={{ background: customizedTheme.backgroundColor }}
          className={collapsed ? 'collapsed' : ''}
        >
          <div className="cancel-ant-layout-header">
            <div className="horizontalWrapper">
              <div className="topbarWrapper">
                <div className="isoLeft">
                  <div className="logo-container" style={{ margin: '0px' }}>
                    <Link to="/">
                      <img src="https://res.cloudinary.com/dd1ixvdxn/image/upload/v1513814413/logo_txyg1i.png" style={{ height: '56px', verticalAlign: 'middle' }} alt="bodhi-logo" />
                    </Link>
                  </div>
                  {/* <div className="isoSearch" style={{ cursor: 'pointer' }}>
                                      <TopbarSearch customizedTheme={customizedTheme} />
                                    </div> */}
                </div>

                <ul className="isoRight">
                  <li><Link to="/" >Events</Link></li>
                  <li><Link to="/create-topic" >Create an Event</Link></li>
                  <li>{walletAddrsEle}</li>
                  <li>
                    <div className="block-count" style={{ color: 'white', paddingTop: '16px', textAlign: 'right' }}>
                      <div className="label" style={{ fontSize: '10px', lineHeight: 'normal' }}><Icon type="clock-circle-o" style={{ marginRight: '6px' }}></Icon>Block Count</div>
                      <div style={{ fontSize: '20px', lineHeight: 'normal', marginTop: '2px' }}>{blockCount}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Header>
        <Modal
          title="Add account"
          okText="Add associated address"
          visible={this.state.visible}
          onOk={this.handleAddAccountClicked}
          onCancel={this.handleCancel}
        >
          <h3>Address</h3>
          <Form className="form-add-address">
            <FormItem>
              <Input
                placeholder="Address"
                value={this.state.addressInput}
                onChange={this.onAddressInputChange}
              />
            </FormItem>
          </Form>
        </Modal>
      </TopbarWrapper>
    );
  }
}

Topbar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  walletAddrs: PropTypes.array,
  selectedWalletAddress: PropTypes.string,
  addWalletAddress: PropTypes.func,
  selectWalletAddress: PropTypes.func,
  listUnspent: PropTypes.func,
  onGetBlockCount: PropTypes.func,
  blockCount: PropTypes.number,
  getBotBalance: PropTypes.func,
};

Topbar.defaultProps = {
  walletAddrs: [],
  selectedWalletAddress: undefined,
  addWalletAddress: undefined,
  selectWalletAddress: undefined,
  listUnspent: undefined,
  onGetBlockCount: undefined,
  blockCount: 0,
  getBotBalance: undefined,
};

const mapStateToProps = (state) => ({
  ...state.App.toJS(),
  walletAddrs: state.App.get('walletAddrs'),
  blockCount: state.App.get('get_block_count_return') && state.App.get('get_block_count_return').result,
  selectedWalletAddress: state.App.get('selected_wallet_address'),
});

const mapDispatchToProps = (dispatch) => ({
  addWalletAddress: (value) => dispatch(appActions.addWalletAddress(value)),
  selectWalletAddress: (value) => dispatch(appActions.selectWalletAddress(value)),
  listUnspent: () => dispatch(appActions.listUnspent()),
  onGetBlockCount: () => dispatch(appActions.getBlockCount()),
  getBotBalance: (owner, senderAddress) => dispatch(appActions.getBotBalance(owner, senderAddress)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Topbar);
