/* eslint react/prop-types: 0 */ // --> OFF

import _ from 'lodash';
import React, { PropTypes } from 'react';
import { Row, Col, Alert, Button, Form, Input, message, InputNumber, DatePicker } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import { DynamicFieldSet } from '../form/DynamicFieldSet';
import topicActions from '../../redux/topic/actions';
import appActions from '../../redux/app/actions';
import { calculateBlock } from '../../helpers/utility';

const FormItem = Form.Item;
const Web3Utils = require('web3-utils');

const SPACING_FORM_ITEM = 24;
const MIN_OPTION_NUMBER = 2;
const MAX_OPTION_NUMBER = 10;
const MAX_LEN_EVENTNAME_HEX = 640;

const ID_BETTING_START_TIME = 'bettingStartTime';
const ID_BETTING_END_TIME = 'bettingEndTime';
const ID_RESULT_SETTING_START_TIME = 'resultSettingStartTime';
const ID_RESULT_SETTING_END_TIME = 'resultSettingEndTime';

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
    this.onDatePickerDateSelect = this.onDatePickerDateSelect.bind(this);
    this.validateTitleLength = this.validateTitleLength.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentWillMount() {
    this.props.onGetBlockCount();
  }

  componentWillUnmount() {
    this.props.onClearCreateReturn();
  }

  render() {
    const { createReturn, blockCount } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
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

    return (
      <div className="create-topic-container">
        <h3>Create an event</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="Name"
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

          {this.renderBlockField(formItemLayout, ID_BETTING_START_TIME, blockCount)}
          {this.renderBlockField(formItemLayout, ID_BETTING_END_TIME, blockCount)}
          {this.renderBlockField(formItemLayout, ID_RESULT_SETTING_START_TIME, blockCount)}
          {this.renderBlockField(formItemLayout, ID_RESULT_SETTING_END_TIME, blockCount)}

          <FormItem
            {...formItemLayout}
            label="Results"
            style={{ marginBottom: SPACING_FORM_ITEM }}
          >
            {getFieldDecorator('results', {
              rules: [
                {
                  required: true,
                  message: 'Results cannot be empty.',
                },
              ],
            })(<DynamicFieldSet
              form={this.props.form}
            />)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Centralized Oracle"
            extra="This person will set the result."
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

  renderBlockField(formItemLayout, id, blockCount) {
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
        label = 'Betting Start Time';
        extra = 'The time when users can start betting.';
        options = {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{
            required: true,
            message: 'Must be greater than or equal to current time.',
          }],
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
          rules: [{
            required: true,
            message: 'Must be greater than Betting Start Block.',
          }],
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
          rules: [{
            required: true,
            message: 'Must be greater than or equal to Betting End Time.',
          }],
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
          rules: [{
            required: true,
            message: 'Must be greater than Result Setting Start Time.',
          }],
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

  onDatePickerDateSelect(id, date) {
    const localDate = date.local();
    const block = calculateBlock(this.props.blockCount, localDate);

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

  handleSubmit(evt) {
    evt.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // Maps form variables to saga request variables
        const {
          centralizedOracle,
          name,
          results,
          bettingStartBlock,
          bettingEndBlock,
          resultSettingStartBlock,
          resultSettingEndBlock,
        } = values;

        this.props.onCreateTopic({
          centralizedOracle,
          name,
          results,
          bettingStartBlock: bettingStartBlock.toString(),
          bettingEndBlock: bettingEndBlock.toString(),
          resultSettingStartBlock: resultSettingStartBlock.toString(),
          resultSettingEndBlock: resultSettingEndBlock.toString(),
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
  onGetBlockCount: PropTypes.func,
  walletAddrs: PropTypes.array,
  walletAddrsIndex: PropTypes.number,
  blockCount: PropTypes.number,
};

CreateTopic.defaultProps = {
  createReturn: undefined,
  onCreateTopic: undefined,
  onClearCreateReturn: undefined,
  onGetBlockCount: undefined,
  walletAddrs: [],
  walletAddrsIndex: 0,
  blockCount: 0,
};

const mapStateToProps = (state) => ({
  createReturn: state.Topic.get('create_return'),
  walletAddrs: state.App.get('walletAddrs'),
  walletAddrsIndex: state.App.get('walletAddrsIndex'),
  blockCount: state.App.get('get_block_count_return') && state.App.get('get_block_count_return').result,
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateTopic: (params) => dispatch(topicActions.onCreate(params)),
    onClearCreateReturn: () => dispatch(topicActions.onClearCreateReturn()),
    onGetBlockCount: () => dispatch(appActions.getBlockCount()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Form.create()(CreateTopic)));
