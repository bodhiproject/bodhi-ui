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
import { calculateDate, calculateBlock } from '../../helpers/utility';

const FormItem = Form.Item;
const Web3Utils = require('web3-utils');

const SPACING_FORM_ITEM = 24;
const MIN_OPTION_NUMBER = 2;
const MAX_OPTION_NUMBER = 10;
const MAX_LEN_EVENTNAME_HEX = 640;

const ID_BETTING_START_BLOCK = 'bettingStartBlock';
const ID_BETTING_END_BLOCK = 'bettingEndBlock';
const ID_RESULT_SETTING_START_BLOCK = 'resultSettingStartBlock';
const ID_RESULT_SETTING_END_BLOCK = 'resultSettingEndBlock';

class CreateTopic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bettingStartBlockDate: undefined,
      bettingEndBlockDate: undefined,
      resultSettingStartBlockDate: undefined,
      resultSettingEndBlockDate: undefined,
    };

    this.getCurrentSenderAddress = this.getCurrentSenderAddress.bind(this);
    this.renderAlertBox = this.renderAlertBox.bind(this);
    this.renderBlockField = this.renderBlockField.bind(this);
    this.onBlockNumberChange = this.onBlockNumberChange.bind(this);
    this.onCalendarChange = this.onCalendarChange.bind(this);
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

          {this.renderBlockField(formItemLayout, ID_BETTING_START_BLOCK, blockCount)}
          {this.renderBlockField(formItemLayout, ID_BETTING_END_BLOCK, blockCount)}
          {this.renderBlockField(formItemLayout, ID_RESULT_SETTING_START_BLOCK, blockCount)}
          {this.renderBlockField(formItemLayout, ID_RESULT_SETTING_END_BLOCK, blockCount)}

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
      bettingStartBlockDate,
      bettingEndBlockDate,
      resultSettingStartBlockDate,
      resultSettingEndBlockDate,
    } = this.state;

    let label;
    let extra;
    let options;
    let min;
    let date;
    switch (id) {
      case ID_BETTING_START_BLOCK: {
        label = 'Betting Start Block';
        extra = 'The block when users can bet.';
        options = {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{
            required: true,
            message: 'Must be greater than or equal to current block number.',
          }],
        };
        min = blockCount;
        date = bettingStartBlockDate;
        break;
      }
      case ID_BETTING_END_BLOCK: {
        label = 'Betting End Block';
        extra = 'The block when users can no longer bet.';
        options = {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{
            required: true,
            message: 'Must be greater than Betting Start Block.',
          }],
        };
        min = _.isNumber(this.props.form.getFieldValue(ID_BETTING_START_BLOCK)) ?
          this.props.form.getFieldValue(ID_BETTING_START_BLOCK) + 1 : blockCount + 1;
        date = bettingEndBlockDate;
        break;
      }
      case ID_RESULT_SETTING_START_BLOCK: {
        label = 'Result Setting Start Block';
        extra = 'The block when the Centralized Oracle can set the result.';
        options = {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{
            required: true,
            message: 'Must be greater than or equal to Betting End Block.',
          }],
        };
        min = _.isNumber(this.props.form.getFieldValue(ID_BETTING_END_BLOCK)) ?
          this.props.form.getFieldValue(ID_BETTING_END_BLOCK) : blockCount + 1;
        date = resultSettingStartBlockDate;
        break;
      }
      case ID_RESULT_SETTING_END_BLOCK: {
        label = 'Result Setting End Block';
        extra = 'The block when anyone can set the result.';
        options = {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{
            required: true,
            message: 'Must be greater than Result Setting Start Block.',
          }],
        };
        min = _.isNumber(this.props.form.getFieldValue(ID_RESULT_SETTING_START_BLOCK)) ?
          this.props.form.getFieldValue(ID_RESULT_SETTING_START_BLOCK) + 1 : blockCount + 1;
        date = resultSettingEndBlockDate;
        break;
      }
      default: {
        throw new Error(`Unhandled id ${id}`);
      }
    }
    const parsedDate = date && date.isValid() ? date : null;

    return (
      <FormItem
        {...formItemLayout}
        label={label}
        extra={extra}
        style={{ marginBottom: SPACING_FORM_ITEM }}
      >
        <Row gutter={8}>
          <Col span={6}>
            {this.props.form.getFieldDecorator(id, options)(<InputNumber
              min={min}
              step={1}
              onChange={(e) => this.onBlockNumberChange(id, e)}
            />)}
          </Col>
          <Col span={8}>
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss z"
              placeholder="Select Date & Time"
              style={{ width: '100%' }}
              defaultValue={parsedDate}
              value={parsedDate}
              onChange={(e) => this.onCalendarChange(id, e)}
              disabledDate={(current) => current < moment().utc().subtract('1', 'days').endOf('day')}
              allowClear={false}
            />
          </Col>
        </Row>
      </FormItem>
    );
  }

  onBlockNumberChange(id, blockNum) {
    const date = calculateDate(this.props.blockCount, blockNum);

    switch (id) {
      case ID_BETTING_START_BLOCK: {
        this.setState({
          bettingStartBlockDate: date,
        });
        break;
      }
      case ID_BETTING_END_BLOCK: {
        this.setState({
          bettingEndBlockDate: date,
        });
        break;
      }
      case ID_RESULT_SETTING_START_BLOCK: {
        this.setState({
          resultSettingStartBlockDate: date,
        });
        break;
      }
      case ID_RESULT_SETTING_END_BLOCK: {
        this.setState({
          resultSettingEndBlockDate: date,
        });
        break;
      }
      default: {
        throw new Error(`Unhandled id ${id}`);
      }
    }
  }

  onCalendarChange(id, date) {
    const block = calculateBlock(this.props.blockCount, date);

    switch (id) {
      case ID_BETTING_START_BLOCK: {
        this.setState({
          bettingStartBlockDate: date,
        });
        this.props.form.setFieldsValue({
          bettingStartBlock: block,
        });
        break;
      }
      case ID_BETTING_END_BLOCK: {
        this.setState({
          bettingEndBlockDate: date,
        });
        this.props.form.setFieldsValue({
          bettingEndBlock: block,
        });
        break;
      }
      case ID_RESULT_SETTING_START_BLOCK: {
        this.setState({
          resultSettingStartBlockDate: date,
        });
        this.props.form.setFieldsValue({
          resultSettingStartBlock: block,
        });
        break;
      }
      case ID_RESULT_SETTING_END_BLOCK: {
        this.setState({
          resultSettingEndBlockDate: date,
        });
        this.props.form.setFieldsValue({
          resultSettingEndBlock: block,
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
