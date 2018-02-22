/* eslint react/prop-types: 0 */ // --> OFF

import _ from 'lodash';
import React, { PropTypes } from 'react';
import { Row, Col, Alert, Button, Form, Input, message, InputNumber, DatePicker, Icon } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import Web3Utils from 'web3-utils';

import topicActions from '../../redux/topic/actions';
import appActions from '../../redux/app/actions';
import { calculateBlock } from '../../helpers/utility';
import { defaults } from '../../config/app';

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
    this.props.onClearCreateReturn();
  }

  render() {
    const { createReturn } = this.props;
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
        <h3>Create an event</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="Name"
            required={required}
            style={{ marginBottom: SPACING_FORM_ITEM }}
          >
            {getFieldDecorator('name', {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Event name cannot be empty.',
                },
                {
                  validator: this.validateTitleLength,
                },
              ],
            })(<Input
              placeholder="e.g. Who will be the next president of the United States?"
            />)}
          </FormItem>

          {this.renderBlockField(formItemLayout, ID_BETTING_START_TIME)}
          {this.renderBlockField(formItemLayout, ID_BETTING_END_TIME)}
          {this.renderBlockField(formItemLayout, ID_RESULT_SETTING_START_TIME)}
          {this.renderBlockField(formItemLayout, ID_RESULT_SETTING_END_TIME)}

          <FormItem
            {...formItemLayout}
            label="Results"
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
                  <Icon type="plus" />Add Result
                </Button>
              ) : null}
            </FormItem>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Centralized Oracle"
            extra="This person will set the result."
            required={required}
          >
            {getFieldDecorator('centralizedOracle', {
              rules: [{
                required: true,
                whitespace: true,
                message: 'Centralized Oracle cannot be empty.',
              }],
            })(<Input placeholder="e.g. qavn7QqvdHPYKr71bNWJo4tcmcgTKaYfjM" />)}
          </FormItem>

          <FormItem {...tailFormItemLayout} className="submit-controller">
            {this.renderAlertBox(createReturn)}
            <Button
              type="primary"
              htmlType="submit"
              disabled={createReturn && createReturn.result}
            >Publish</Button>
            <Button
              type="default"
              onClick={this.onCancel}
            >{(createReturn && createReturn.result) ? 'Back' : 'Cancel'}</Button>
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

  renderAlertBox(createReturn) {
    let alertElement;
    if (createReturn) {
      if (createReturn.result) {
        alertElement =
            (<Alert
              message="Success!"
              description={`The transaction is broadcasted to blockchain. 
                You can view details from below link https://testnet.qtum.org/tx/${createReturn.result.txid}`}
              type="success"
              closable={false}
            />);
      } else if (createReturn.error) {
        alertElement = (<Alert
          message="Oops, something went wrong"
          description={createReturn.error}
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
    const { syncInfo } = this.props;
    const {
      bettingStartBlock,
      bettingEndBlock,
      resultSettingStartBlock,
      resultSettingEndBlock,
    } = this.state;
    const blockNumDisabled = true;
    const blockCount = syncInfo.chainBlockNum;

    let label;
    let extra;
    let options;
    let min;
    let block;
    switch (id) {
      case ID_BETTING_START_TIME: {
        label = 'Betting Start Time';
        extra = 'The time when users can start betting.';
        options = {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              message: 'Betting Start Time cannot be empty',
            },
          ],
        };
        min = blockCount;
        block = bettingStartBlock;
        break;
      }
      case ID_BETTING_END_TIME: {
        label = 'Betting End Time';
        extra = 'The time when users can no longer bet.';
        options = {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              message: 'Betting End Time cannot be empty',
            },
            {
              validator: this.validateBettingEndTime,
            },
          ],
        };
        min = _.isNumber(this.props.form.getFieldValue(ID_BETTING_START_TIME)) ?
          this.props.form.getFieldValue(ID_BETTING_START_TIME) + 1 : blockCount + 1;
        block = bettingEndBlock;
        break;
      }
      case ID_RESULT_SETTING_START_TIME: {
        label = 'Result Setting Start Time';
        extra = 'The time when the Centralized Oracle can set the result.';
        options = {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              message: 'Result Setting Start Time cannot be empty',
            },
            {
              validator: this.validateResultSettingStartTime,
            },
          ],
        };
        min = _.isNumber(this.props.form.getFieldValue(ID_BETTING_END_TIME)) ?
          this.props.form.getFieldValue(ID_BETTING_END_TIME) : blockCount + 1;
        block = resultSettingStartBlock;
        break;
      }
      case ID_RESULT_SETTING_END_TIME: {
        label = 'Result Setting End Time';
        extra = 'The time when anyone can set the result.';
        options = {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              message: 'Result Setting End Time cannot be empty',
            },
            {
              validator: this.validateResultSettingEndTime,
            },
          ],
        };
        min = _.isNumber(this.props.form.getFieldValue(ID_RESULT_SETTING_START_TIME)) ?
          this.props.form.getFieldValue(ID_RESULT_SETTING_START_TIME) + 1 : blockCount + 1;
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
              placeholder="Select Date & Time"
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
              message: 'Result name cannot be empty.',
            },
            {
              validator: this.validateResultLength,
            },
          ],
        })(<Input
          placeholder={`Result #${index + 1}`}
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
      syncInfo,
      averageBlockTime,
    } = this.props;

    const blockCount = syncInfo.chainBlockNum;
    const localDate = date.local();
    const block = calculateBlock(blockCount, localDate, averageBlockTime);

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
      callback('Event name is too long.');
    }
  }

  validateBettingEndTime(rule, value, callback) {
    const bettingStartTime = this.props.form.getFieldValue(ID_BETTING_START_TIME);
    if (_.isUndefined(bettingStartTime) || value.unix() <= bettingStartTime.unix()) {
      callback('Must be greater than Betting Start Time');
    } else {
      callback();
    }
  }

  validateResultSettingStartTime(rule, value, callback) {
    const bettingEndTime = this.props.form.getFieldValue(ID_BETTING_END_TIME);
    if (_.isUndefined(bettingEndTime) || value.unix() < bettingEndTime.unix()) {
      callback('Must be greater than or equal to Betting End Time');
    } else {
      callback();
    }
  }

  validateResultSettingEndTime(rule, value, callback) {
    const resultSettingStartTime = this.props.form.getFieldValue(ID_RESULT_SETTING_START_TIME);
    if (_.isUndefined(resultSettingStartTime) || value.unix() <= resultSettingStartTime.unix()) {
      callback('Must be greater than Result Setting Start Time');
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
      callback('Result name is too long.');
    }
  }

  handleSubmit(evt) {
    evt.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // Maps form variables to saga request variables
        const {
          centralizedOracle,
          name,
          results,
          bettingStartTime,
          bettingEndTime,
          resultSettingStartTime,
          resultSettingEndTime,
        } = values;

        this.props.onCreateTopic({
          centralizedOracle,
          name,
          results,
          bettingStartTime: bettingStartTime.utc().unix().toString(),
          bettingEndTime: bettingEndTime.utc().unix().toString(),
          resultSettingStartTime: resultSettingStartTime.utc().unix().toString(),
          resultSettingEndTime: resultSettingEndTime.utc().unix().toString(),
          senderAddress: this.getCurrentSenderAddress(),
        });
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
  createReturn: PropTypes.object,
  onCreateTopic: PropTypes.func,
  onClearCreateReturn: PropTypes.func,
  getInsightTotals: PropTypes.func,
  walletAddrs: PropTypes.array,
  walletAddrsIndex: PropTypes.number,
  syncInfo: PropTypes.object,
  averageBlockTime: PropTypes.number,
};

CreateTopic.defaultProps = {
  createReturn: undefined,
  onCreateTopic: undefined,
  onClearCreateReturn: undefined,
  getInsightTotals: undefined,
  walletAddrs: [],
  walletAddrsIndex: 0,
  syncInfo: undefined,
  averageBlockTime: defaults.averageBlockTime,
};

const mapStateToProps = (state) => ({
  createReturn: state.Topic.get('create_return'),
  walletAddrs: state.App.get('walletAddrs'),
  walletAddrsIndex: state.App.get('walletAddrsIndex'),
  syncInfo: state.App.get('syncInfo') && state.App.get('syncInfo').result,
  averageBlockTime: state.App.get('averageBlockTime'),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateTopic: (params) => dispatch(topicActions.onCreate(params)),
    onClearCreateReturn: () => dispatch(topicActions.onClearCreateReturn()),
    getInsightTotals: () => dispatch(appActions.getInsightTotals()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Form.create()(CreateTopic)));
