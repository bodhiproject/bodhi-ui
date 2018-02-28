/* eslint react/prop-types: 0 */ // --> OFF

import _ from 'lodash';
import React, { PropTypes } from 'react';
import { Row, Col, Alert, Button, Form, Input, message, InputNumber, DatePicker, Icon } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import Web3Utils from 'web3-utils';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import graphqlActions from '../../../services/redux/graphql/actions';
import stateActions from '../../../services/redux/state/actions';
import appActions from '../../../services/redux/app/actions';
import { calculateBlock } from '../../../helpers/utility';
import { defaults } from '../../../config/app';

const FormItem = Form.Item;

const SPACING_FORM_ITEM = 24;
const MIN_OPTION_NUMBER = 2;
const MAX_OPTION_NUMBER = 10;
const MAX_LEN_EVENTNAME_HEX = 640;
const MAX_LEN_RESULT_HEX = 64;
const WIDTH_RESULT_FIELD = '60%';

const ID_BETTING_START_TIME = 'bettingStartTime';
const ID_BETTING_END_TIME = 'bettingEndTime';
const ID_RESULT_SETTING_START_TIME = 'resultSettingStartTime';
const ID_RESULT_SETTING_END_TIME = 'resultSettingEndTime';

let resultUuid = 2;

class CreateTopic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bettingStartBlock: undefined,
      bettingEndBlock: undefined,
      resultSettingStartBlock: undefined,
      resultSettingEndBlock: undefined,
    };

    this.getCurrentSenderAddress = this.getCurrentSenderAddress.bind(this);
    this.renderAlertBox = this.renderAlertBox.bind(this);
    this.renderBlockField = this.renderBlockField.bind(this);
    this.renderResultsFields = this.renderResultsFields.bind(this);
    this.onDatePickerDateSelect = this.onDatePickerDateSelect.bind(this);
    this.onAddResultField = this.onAddResultField.bind(this);
    this.onRemoveResultField = this.onRemoveResultField.bind(this);
    this.validateTitleLength = this.validateTitleLength.bind(this);
    this.validateBettingEndTime = this.validateBettingEndTime.bind(this);
    this.validateResultSettingStartTime = this.validateResultSettingStartTime.bind(this);
    this.validateResultSettingEndTime = this.validateResultSettingEndTime.bind(this);
    this.validateResultLength = this.validateResultLength.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentWillMount() {
    this.props.getInsightTotals();
  }

  componentWillUnmount() {
    this.props.clearTxReturn();
  }

  render() {
    const { txReturn } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const labelCol = {
      xs: { span: 24 },
      sm: { span: 6 },
    };
    const wrapperCol = {
      xs: { span: 24 },
      sm: { span: 18 },
    };
    const formItemLayout = {
      labelCol,
      wrapperCol,
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 18,
          offset: 6,
        },
      },
    };
    let keys = getFieldValue('keys');
    if (_.isUndefined(keys)) {
      keys = ['0', '1'];
    }
    const required = true;
    return (
      <div className="create-topic-container">
        <h3><FormattedMessage id="create.title" /></h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="create.name" />}
            required={required}
            style={{ marginBottom: SPACING_FORM_ITEM }}
          >
            {getFieldDecorator('name', {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: this.props.intl.formatMessage({ id: 'create.evtnotempty' }),
                },
                {
                  validator: this.validateTitleLength,
                },
              ],
            })(<Input
              placeholder={this.props.intl.formatMessage({ id: 'create.nameplaceholder' })}
            />)}
          </FormItem>

          {this.renderBlockField(formItemLayout, ID_BETTING_START_TIME)}
          {this.renderBlockField(formItemLayout, ID_BETTING_END_TIME)}
          {this.renderBlockField(formItemLayout, ID_RESULT_SETTING_START_TIME)}
          {this.renderBlockField(formItemLayout, ID_RESULT_SETTING_END_TIME)}

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="create.results" />}
            required={required}
            style={{ marginBottom: SPACING_FORM_ITEM }}
          >
            {this.renderResultsFields(wrapperCol)}
            <FormItem {...wrapperCol}>
              {keys.length < 10 ? (
                <Button
                  type="dashed"
                  onClick={this.onAddResultField}
                  style={{ width: WIDTH_RESULT_FIELD, marginBottom: '32px' }}
                >
                  <Icon type="plus" /><FormattedMessage id="create.addresult" />
                </Button>
              ) : null}
            </FormItem>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={this.props.intl.formatMessage({ id: 'create.resultsetter' })}
            extra={this.props.intl.formatMessage({ id: 'create.resultsetterextra' })}
            required={required}
          >
            {getFieldDecorator('centralizedOracle', {
              rules: [{
                required: true,
                whitespace: true,
                message: this.props.intl.formatMessage({ id: 'create.COnotempty' }),
              }],
            })(<Input placeholder="e.g. qavn7QqvdHPYKr71bNWJo4tcmcgTKaYfjM" />)}
          </FormItem>

          <FormItem {...tailFormItemLayout} className="submit-controller">
            {this.renderAlertBox(txReturn)}
            <Button
              type="primary"
              htmlType="submit"
              disabled={txReturn && txReturn.txid}
            >
              <FormattedMessage id="create.publish" />
            </Button>
            <Button
              type="default"
              onClick={this.onCancel}
            >
              {(txReturn && txReturn.txid)
                ? <FormattedMessage id="create.back" />
                : <FormattedMessage id="create.cancel" />}
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }

  getCurrentSenderAddress() {
    const { walletAddrs, walletAddrsIndex } = this.props;

    if (!_.isEmpty(walletAddrs)
      && walletAddrsIndex < walletAddrs.length
      && !_.isUndefined(walletAddrs[walletAddrsIndex])) {
      return walletAddrs[walletAddrsIndex].address;
    }
    return '';
  }

  renderAlertBox(txReturn) {
    let alertElement;
    if (txReturn) {
      if (txReturn.txid) {
        alertElement =
            (<Alert
              message="Success!"
              description={`${this.props.intl.formatMessage({ id: 'create.alertsuc' })}
                https://testnet.qtum.org/tx/${txReturn.txid}`}
              type="success"
              closable={false}
            />);
      } else if (txReturn.error) {
        alertElement = (<Alert
          message={this.props.intl.formatMessage({ id: 'create.alertfail' })}
          description={txReturn.error}
          type="error"
          closable={false}
        />);
      }
    }
    return (
      <div className="alert-container">
        {alertElement}
      </div>
    );
  }

  renderBlockField(formItemLayout, id) {
    const { chainBlockNum } = this.props;
    const {
      bettingStartBlock,
      bettingEndBlock,
      resultSettingStartBlock,
      resultSettingEndBlock,
    } = this.state;
    const blockNumDisabled = true;

    let label;
    let extra;
    let options;
    let min;
    let block;
    switch (id) {
      case ID_BETTING_START_TIME: {
        label = this.props.intl.formatMessage({ id: 'create.betstartblock' });
        extra = this.props.intl.formatMessage({ id: 'create.betstartblockextra' });
        options = {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              message: this.props.intl.formatMessage({ id: 'create.betstartblockmsg' }),
            },
          ],
        };
        min = chainBlockNum;
        block = bettingStartBlock;
        break;
      }
      case ID_BETTING_END_TIME: {
        label = this.props.intl.formatMessage({ id: 'create.betendblock' });
        extra = this.props.intl.formatMessage({ id: 'create.betendblocksxtra' });
        options = {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              message: this.props.intl.formatMessage({ id: 'create.betendblocksmsg' }),
            },
            {
              validator: this.validateBettingEndTime,
            },
          ],
        };
        min = _.isNumber(this.props.form.getFieldValue(ID_BETTING_START_TIME)) ?
          this.props.form.getFieldValue(ID_BETTING_START_TIME) + 1 : chainBlockNum + 1;
        block = bettingEndBlock;
        break;
      }
      case ID_RESULT_SETTING_START_TIME: {
        label = this.props.intl.formatMessage({ id: 'create.resultsetstartblock' });
        extra = this.props.intl.formatMessage({ id: 'create.resultsetstartblockextra' });
        options = {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              message: this.props.intl.formatMessage({ id: 'create.resultsetstartblockmsg' }),
            },
            {
              validator: this.validateResultSettingStartTime,
            },
          ],
        };
        min = _.isNumber(this.props.form.getFieldValue(ID_BETTING_END_TIME)) ?
          this.props.form.getFieldValue(ID_BETTING_END_TIME) : chainBlockNum + 1;
        block = resultSettingStartBlock;
        break;
      }
      case ID_RESULT_SETTING_END_TIME: {
        label = this.props.intl.formatMessage({ id: 'create.resultsetendblock' });
        extra = this.props.intl.formatMessage({ id: 'create.resultsetendblockextra' });
        options = {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              message: this.props.intl.formatMessage({ id: 'create.resultsetendblockmsg' }),
            },
            {
              validator: this.validateResultSettingEndTime,
            },
          ],
        };
        min = _.isNumber(this.props.form.getFieldValue(ID_RESULT_SETTING_START_TIME)) ?
          this.props.form.getFieldValue(ID_RESULT_SETTING_START_TIME) + 1 : chainBlockNum + 1;
        block = resultSettingEndBlock;
        break;
      }
      default: {
        throw new Error(`Unhandled id ${id}`);
      }
    }

    return (
      <FormItem
        {...formItemLayout}
        label={label}
        extra={extra}
        style={{ marginBottom: SPACING_FORM_ITEM }}
      >
        <Row gutter={8}>
          <Col span={10}>
            {this.props.form.getFieldDecorator(id, options)(<DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss Z"
              placeholder={this.props.intl.formatMessage({ id: 'create.datetime' })}
              style={{ width: '100%' }}
              onChange={(e) => this.onDatePickerDateSelect(id, e)}
              disabledDate={(current) => current < moment().subtract('1', 'days').endOf('day')}
              allowClear={false}
            />)}
          </Col>
          <Col span={4}>
            <InputNumber disabled={blockNumDisabled} value={block} />
          </Col>
        </Row>
      </FormItem>
    );
  }

  renderResultsFields(wrapperCol) {
    const {
      getFieldDecorator,
      getFieldValue,
    } = this.props.form;

    getFieldDecorator('keys', { initialValue: ['0', '1'] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <FormItem
        {...wrapperCol}
        key={k}
      >
        {getFieldDecorator(`results[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: this.props.intl.formatMessage({ id: 'create.resultsmsg' }),
            },
            {
              validator: this.validateResultLength,
            },
          ],
        })(<Input
          placeholder={`${this.props.intl.formatMessage({ id: 'create.resultindex' })} #${index + 1}`}
          style={{ width: WIDTH_RESULT_FIELD, marginRight: '8px' }}
        />)}
        {keys.length > 2 ? (
          <Icon
            className="dynamic-delete-button"
            type="close-circle-o"
            disabled={keys.length === 1}
            onClick={() => this.onRemoveResultField(k)}
            style={{ fontSize: 16 }}
          />
        ) : null}
      </FormItem>));

    return formItems;
  }

  onDatePickerDateSelect(id, date) {
    const {
      chainBlockNum,
      averageBlockTime,
    } = this.props;

    const localDate = date.local();
    const block = calculateBlock(chainBlockNum, localDate, averageBlockTime);

    switch (id) {
      case ID_BETTING_START_TIME: {
        this.setState({
          bettingStartBlock: block,
        });
        this.props.form.setFieldsValue({
          bettingStartTime: localDate,
        });
        break;
      }
      case ID_BETTING_END_TIME: {
        this.setState({
          bettingEndBlock: block,
        });
        this.props.form.setFieldsValue({
          bettingEndTime: localDate,
        });
        break;
      }
      case ID_RESULT_SETTING_START_TIME: {
        this.setState({
          resultSettingStartBlock: block,
        });
        this.props.form.setFieldsValue({
          resultSettingStartTime: localDate,
        });
        break;
      }
      case ID_RESULT_SETTING_END_TIME: {
        this.setState({
          resultSettingEndBlock: block,
        });
        this.props.form.setFieldsValue({
          resultSettingEndTime: localDate,
        });
        break;
      }
      default: {
        throw new Error(`Unhandled id ${id}`);
      }
    }
  }

  onAddResultField() {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const keys = getFieldValue('keys');
    const nextKeys = keys.concat(resultUuid);
    resultUuid += 1;

    setFieldsValue({
      keys: nextKeys,
    });
  }

  onRemoveResultField(k) {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const keys = getFieldValue('keys');

    if (keys.length === 2) {
      return;
    }

    setFieldsValue({
      keys: keys.filter((key) => key !== k),
    });
  }

  validateTitleLength(rule, value, callback) {
    let hexString = _.isUndefined(value) ? '' : value;

    // Remove hex prefix for length validation
    hexString = Web3Utils.toHex(hexString).slice(2);
    if (hexString && hexString.length <= MAX_LEN_EVENTNAME_HEX) {
      callback();
    } else {
      callback(this.props.intl.formatMessage({ id: 'create.namelong' }));
    }
  }

  validateBettingEndTime(rule, value, callback) {
    const bettingStartTime = this.props.form.getFieldValue(ID_BETTING_START_TIME);
    if (_.isUndefined(bettingStartTime) || value.unix() <= bettingStartTime.unix()) {
      callback(this.props.intl.formatMessage({ id: 'create.validbetend' }));
    } else {
      callback();
    }
  }

  validateResultSettingStartTime(rule, value, callback) {
    const bettingEndTime = this.props.form.getFieldValue(ID_BETTING_END_TIME);
    if (_.isUndefined(bettingEndTime) || value.unix() < bettingEndTime.unix()) {
      callback(this.props.intl.formatMessage({ id: 'create.validresultsetstart' }));
    } else {
      callback();
    }
  }

  validateResultSettingEndTime(rule, value, callback) {
    const resultSettingStartTime = this.props.form.getFieldValue(ID_RESULT_SETTING_START_TIME);
    if (_.isUndefined(resultSettingStartTime) || value.unix() <= resultSettingStartTime.unix()) {
      callback(this.props.intl.formatMessage({ id: 'create.validresultsetend' }));
    } else {
      callback();
    }
  }

  validateResultLength(rule, value, callback) {
    let hexString = _.isUndefined(value) ? '' : value;

    // Remove hex prefix for length validation
    hexString = Web3Utils.toHex(hexString).slice(2);
    if (hexString && hexString.length <= MAX_LEN_RESULT_HEX) {
      callback();
    } else {
      callback(this.props.intl.formatMessage({ id: 'create.resulttoolong' }));
    }
  }

  handleSubmit(evt) {
    evt.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {
          name,
          results,
          centralizedOracle,
          bettingStartTime,
          bettingEndTime,
          resultSettingStartTime,
          resultSettingEndTime,
        } = values;

        this.props.createTopicTx(
          name,
          results,
          centralizedOracle,
          bettingStartTime.utc().unix().toString(),
          bettingEndTime.utc().unix().toString(),
          resultSettingStartTime.utc().unix().toString(),
          resultSettingEndTime.utc().unix().toString(),
          this.getCurrentSenderAddress()
        );
      }
    });
  }

  onCancel(evt) {
    evt.preventDefault();

    this.props.history.push('/');
  }
}

CreateTopic.propTypes = {
  form: PropTypes.object.isRequired,
  createTopicTx: PropTypes.func,
  txReturn: PropTypes.object,
  clearTxReturn: PropTypes.func,
  getInsightTotals: PropTypes.func,
  walletAddrs: PropTypes.array,
  walletAddrsIndex: PropTypes.number,
  chainBlockNum: PropTypes.number,
  averageBlockTime: PropTypes.number,
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
};

CreateTopic.defaultProps = {
  createTopicTx: undefined,
  txReturn: undefined,
  clearTxReturn: undefined,
  getInsightTotals: undefined,
  walletAddrs: [],
  walletAddrsIndex: 0,
  chainBlockNum: undefined,
  averageBlockTime: defaults.averageBlockTime,
};

const mapStateToProps = (state) => ({
  txReturn: state.Graphql.get('txReturn'),
  walletAddrs: state.App.get('walletAddrs'),
  walletAddrsIndex: state.App.get('walletAddrsIndex'),
  chainBlockNum: state.App.get('chainBlockNum'),
  averageBlockTime: state.App.get('averageBlockTime'),
});

function mapDispatchToProps(dispatch) {
  return {
    createTopicTx: (
      name,
      results,
      centralizedOracle,
      bettingStartTime,
      bettingEndTime,
      resultSettingStartTime,
      resultSettingEndTime,
      senderAddress
    ) => dispatch(graphqlActions.createTopicTx(
      name,
      results,
      centralizedOracle,
      bettingStartTime,
      bettingEndTime,
      resultSettingStartTime,
      resultSettingEndTime,
      senderAddress
    )),
    clearTxReturn: () => dispatch(graphqlActions.clearTxReturn()),
    getInsightTotals: () => dispatch(appActions.getInsightTotals()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Form.create()(injectIntl(CreateTopic))));
