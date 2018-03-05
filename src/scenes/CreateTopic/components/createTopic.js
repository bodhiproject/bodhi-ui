/* eslint react/prop-types: 0 */ // --> OFF

import _ from 'lodash';
import React, { PropTypes } from 'react';
import { Row, Col, Alert, Button, Form, Input, message, InputNumber, DatePicker, Icon } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import Web3Utils from 'web3-utils';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';

import graphqlActions from '../../../redux/Graphql/actions';
import stateActions from '../../../redux/State/actions';
import appActions from '../../../redux/App/actions';
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

const messages = defineMessages({
  betStartblockMsg: {
    id: 'create.betStartblockMsg',
    defaultMessage: 'Betting Start Time cannot be empty',
  },
  betEndblocksMsg: {
    id: 'create.betEndblocksMsg',
    defaultMessage: 'Betting End Time cannot be empty',
  },
  resultSetstartBlockmsg: {
    id: 'create.resultSetstartBlockmsg',
    defaultMessage: 'Result Setting Start Time cannot be empty',
  },
  resultSetendBlockmsg: {
    id: 'create.resultSetendBlockmsg',
    defaultMessage: 'Result Setting End Time cannot be empty',
  },
  resultsMsg: {
    id: 'create.resultsMsg',
    defaultMessage: 'Result name cannot be empty.',
  },
  evtNotempty: {
    id: 'create.evtNotempty',
    defaultMessage: 'Event name cannot be empty.',
  },
  namePlaceholder: {
    id: 'create.namePlaceholder',
    defaultMessage: 'e.g. Who will be the next president of the United States?',
  },
  COnotEmpty: {
    id: 'create.COnotEmpty',
    defaultMessage: 'Centralized Oracle cannot be empty.',
  },
  dateTime: {
    id: 'create.dateTime',
    defaultMessage: 'Select Date & Time',
  },
  resultIndex: {
    id: 'create.resultIndex',
    defaultMessage: 'Result',
  },
  nameLong: {
    id: 'create.nameLong',
    defaultMessage: 'Event name is too long.',
  },
  validBetend: {
    id: 'create.validBetend',
    defaultMessage: 'Must be greater than Betting Start Time',
  },
  validResultsetStart: {
    id: 'create.validResultsetStart',
    defaultMessage: 'Must be greater than or equal to Betting End Time',
  },
  validResultsetEnd: {
    id: 'create.validResultsetEnd',
    defaultMessage: 'Must be greater than Result Setting Start Time',
  },
  resultToolong: {
    id: 'create.resultToolong',
    defaultMessage: 'Result name is too long.',
  },
  alertSuc: {
    id: 'create.alertSuc',
    defaultMessage: 'The transaction is broadcasted to blockchain. \n You can view details from below link ',
  },
  alertFail: {
    id: 'create.alertFail',
    defaultMessage: 'Oops, something went wrong',
  },
});

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
        <h3><FormattedMessage id="create.title" defaultMessage="Create an event" /></h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="create.name" defaultMessage="Name" />}
            required={required}
            style={{ marginBottom: SPACING_FORM_ITEM }}
          >
            {getFieldDecorator('name', {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: this.props.intl.formatMessage(messages.evtNotempty),
                },
                {
                  validator: this.validateTitleLength,
                },
              ],
            })(<Input
              placeholder={this.props.intl.formatMessage(messages.namePlaceholder)}
            />)}
          </FormItem>

          {this.renderBlockField(formItemLayout, ID_BETTING_START_TIME)}
          {this.renderBlockField(formItemLayout, ID_BETTING_END_TIME)}
          {this.renderBlockField(formItemLayout, ID_RESULT_SETTING_START_TIME)}
          {this.renderBlockField(formItemLayout, ID_RESULT_SETTING_END_TIME)}

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="create.results" defaultMessage="RESULTS" />}
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
                  <Icon type="plus" /><FormattedMessage id="create.addResult" defaultMessage="Add Result" />
                </Button>
              ) : null}
            </FormItem>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="create.resultSetter" defaultMessage="Centralized Oracle" />}
            extra={<FormattedMessage id="create.resultSetterextra" defaultMessage="This person will set the result." />}
            required={required}
          >
            {getFieldDecorator('centralizedOracle', {
              rules: [{
                required: true,
                whitespace: true,
                message: this.props.intl.formatMessage(messages.COnotEmpty),
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
              <FormattedMessage id="create.publish" defaultMessage="Publish" />
            </Button>
            <Button
              type="default"
              onClick={this.onCancel}
            >
              {(txReturn && txReturn.txid)
                ? <FormattedMessage id="create.back" defaultMessage="Back" />
                : <FormattedMessage id="create.cancel" defaultMessage="Cancel" />}
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
              description={`${this.props.intl.formatMessage(messages.alertSuc)}
                https://testnet.qtum.org/tx/${txReturn.txid}`}
              type="success"
              closable={false}
            />);
      } else if (txReturn.error) {
        alertElement = (<Alert
          message={this.props.intl.formatMessage(messages.alertFail)}
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
        label = <FormattedMessage id="create.betStartblock" defaultMessage="BETTING START BLOCK" />;
        extra = <FormattedMessage id="create.betStartblockExtra" defaultMessage="The time when users can start betting." />;
        options = {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              message: this.props.intl.formatMessage(messages.betStartblockMsg),
            },
          ],
        };
        min = chainBlockNum;
        block = bettingStartBlock;
        break;
      }
      case ID_BETTING_END_TIME: {
        label = <FormattedMessage id="create.betEndblock" defaultMessage="Betting End Block" />;
        extra = <FormattedMessage id="create.betEndblocksExtra" defaultMessage="The time when users can no longer bet." />;
        options = {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              message: this.props.intl.formatMessage(messages.betEndblocksMsg),
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
        label = <FormattedMessage id="create.resultSetstartBlock" defaultMessage="Result Setting Start Block" />;
        extra = <FormattedMessage id="create.resultSetstartBlockextra" defaultMessage="The time when the Centralized Oracle can set the result." />;
        options = {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              message: this.props.intl.formatMessage(messages.resultSetstartBlockmsg),
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
        label = <FormattedMessage id="create.resultSetendBlock" defaultMessage="Result Setting End Block" />;
        extra = <FormattedMessage id="create.resultSetendBlockextra" defaultMessage="The time when anyone can set the result." />;
        options = {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              message: this.props.intl.formatMessage(messages.resultSetendBlockmsg),
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
              placeholder={this.props.intl.formatMessage(messages.dateTime)}
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
              message: this.props.intl.formatMessage(messages.resultsMsg),
            },
            {
              validator: this.validateResultLength,
            },
          ],
        })(<Input
          placeholder={`${this.props.intl.formatMessage(messages.resultIndex)} #${index + 1}`}
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
      callback(this.props.intl.formatMessage(messages.nameLong));
    }
  }

  validateBettingEndTime(rule, value, callback) {
    const bettingStartTime = this.props.form.getFieldValue(ID_BETTING_START_TIME);
    if (_.isUndefined(bettingStartTime) || value.unix() <= bettingStartTime.unix()) {
      callback(this.props.intl.formatMessage(messages.validBetend));
    } else {
      callback();
    }
  }

  validateResultSettingStartTime(rule, value, callback) {
    const bettingEndTime = this.props.form.getFieldValue(ID_BETTING_END_TIME);
    if (_.isUndefined(bettingEndTime) || value.unix() < bettingEndTime.unix()) {
      callback(this.props.intl.formatMessage(messages.validResultsetStart));
    } else {
      callback();
    }
  }

  validateResultSettingEndTime(rule, value, callback) {
    const resultSettingStartTime = this.props.form.getFieldValue(ID_RESULT_SETTING_START_TIME);
    if (_.isUndefined(resultSettingStartTime) || value.unix() <= resultSettingStartTime.unix()) {
      callback(this.props.intl.formatMessage(messages.validResultsetEnd));
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
      callback(this.props.intl.formatMessage(messages.resultToolong));
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
