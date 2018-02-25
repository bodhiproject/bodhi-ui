import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Layout, Menu, Dropdown, Icon, message, Button, Modal, Form, Input, Row, Col, Tag } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import moment from 'moment';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import appActions from '../../redux/app/actions';
import TopbarWrapper from './styles';
import AppConfig from '../../config/app';
import { shortenAddress } from '../../helpers/utility';

const FormItem = Form.Item;
const { Header } = Layout;
const DROPDOWN_LIST_MAX_LENGTH = 8;
const ADDRESS_TEXT_MAX_LENGTH = 11;
const KEY_ADD_ADDRESS_BTN = 'add_address';

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
          <Tag >{qtum.toFixed(2)} QTUM</Tag>
        </Col>
        <Col>
          <Tag>{bot.toFixed(2)} BOT</Tag>
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
    const {
      listUnspent,
      getBotBalance,
      walletAddrs,
    } = this.props;

    listUnspent();
    if (!_.isEmpty(walletAddrs)) {
      _.each(walletAddrs, (address) => {
        getBotBalance(address.address, address.address);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      walletAddrs,
      syncBlockNum,
      listUnspent,
      getBotBalance,
    } = this.props;

    // Update page on new block
    if (nextProps.syncBlockNum !== syncBlockNum) {
      listUnspent();

      if (nextProps.walletAddrs) {
        _.each(nextProps.walletAddrs, (address) => {
          getBotBalance(address.address, address.address);
        });
      }
    }
  }

  render() {
    const {
      collapsed,
      walletAddrs,
      selectedWalletAddress,
    } = this.props;

    const menu = (
      <Menu onClick={this.onAddressDropdownClick}>
        {
          // Build dropdown list using walletAddrs array
          _.map(walletAddrs.slice(0, DROPDOWN_LIST_MAX_LENGTH), (item, index) => (
            <Menu.Item
              key={item.address}
              index={index}
              style={{ padding: 0, borderBottom: '1px solid #eee' }}
            >
              <DropdownMenuItemWrapper
                index={index}
                onCopyClick={this.onCopyClicked}
              />
            </Menu.Item>
          ))}
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
          className={collapsed ? 'collapsed' : ''}
        >
          <div className="cancel-ant-layout-header">
            <div>
              <div className="topbarWrapper">
                <div className="isoLeft">
                  <div className="logo-container" style={{ margin: '0px' }}>
                    <Link to="/">
                      <img
                        src="http://res.cloudinary.com/dd1ixvdxn/image/upload/c_scale,h_38/v1514426750/logo_en_oa4ewt.svg"
                        style={{ height: '38px', verticalAlign: 'middle' }}
                        alt="bodhi-logo"
                      />
                    </Link>
                  </div>
                </div>

                <ul className="isoRight">
                  <li><Link to="/" ><FormattedMessage id="topbar.events" /></Link></li>
                  <li><Link to="/create-topic" ><FormattedMessage id="topbar.create" /></Link></li>
                  <li>{walletAddrsEle}</li>
                  <li><Button onClick={this.props.handler}><FormattedMessage id="language.select" /></Button></li>
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
}

Topbar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  walletAddrs: PropTypes.array,
  selectedWalletAddress: PropTypes.string,
  addWalletAddress: PropTypes.func,
  selectWalletAddress: PropTypes.func,
  listUnspent: PropTypes.func,
  getBotBalance: PropTypes.func,
  syncBlockNum: PropTypes.number,
  handler: PropTypes.func,
};

Topbar.defaultProps = {
  walletAddrs: [],
  selectedWalletAddress: undefined,
  addWalletAddress: undefined,
  selectWalletAddress: undefined,
  listUnspent: undefined,
  getBotBalance: undefined,
  syncBlockNum: undefined,
  handler: undefined,
};

const mapStateToProps = (state) => ({
  ...state.App.toJS(),
  walletAddrs: state.App.get('walletAddrs'),
  selectedWalletAddress: state.App.get('selected_wallet_address'),
  syncBlockNum: state.App.get('syncBlockNum'),
});

const mapDispatchToProps = (dispatch) => ({
  addWalletAddress: (value) => dispatch(appActions.addWalletAddress(value)),
  selectWalletAddress: (value) => dispatch(appActions.selectWalletAddress(value)),
  listUnspent: () => dispatch(appActions.listUnspent()),
  getBotBalance: (owner, senderAddress) => dispatch(appActions.getBotBalance(owner, senderAddress)),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Topbar));
