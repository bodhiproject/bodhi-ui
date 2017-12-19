/* eslint react/prop-types: 0 */ // --> OFF

import _ from 'lodash';
import React, { PropTypes } from 'react';
import { Alert, Button, Form, Input } from 'antd';
import { connect } from 'react-redux';

import actions from '../../redux/topic/actions';

const FormItem = Form.Item;

class CreateTopic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [],
      // bettingEndBlock: 0,
      // resultSettingEndBlock: 0,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOptionsInputChange = this.handleOptionsInputChange.bind(this);
  }

  componentWillUnmount() {
    this.props.onClearCreateReturn();
  }

  handleSubmit(evt) {
    evt.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // Maps form variables to saga request variables
        const {
          resultSetter: resultSetterAddress,
          title: name,
          options,
          bettingEndBlock,
          resultSettingEndBlock,
        } = values;

        const senderAddress = this.props.walletAddrs[this.props.walletAddrsIndex].address;

        this.props.onCreateTopic({
          resultSetterAddress,
          name,
          options,
          bettingEndBlock,
          resultSettingEndBlock,
          senderAddress,
        });
      }
    });
  }

  handleOptionsInputChange(value) {
    this.props.form.setFieldsValue({
      options: value,
    });
  }

  render() {
    const { createReturn } = this.props;
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

    const optionsEle = _.map(this.state.options, (item) => (<Input />));

    let alertElement;

    if (createReturn) {
      if (createReturn.result) {
        alertElement =
            (<Alert
              message="Success!"
              description={`The transaction is broadcasted to blockchain. You can view details from below link https://testnet.qtum.org/tx/${createReturn.result.txid}`}
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
    const alertContainer = <div className="alert-container">{alertElement}</div>;

    return (

      <div className="create-topic-container">
        <h3>Create an event</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="Title"
          >
            {getFieldDecorator('title', {
              rules: [{
                required: true, message: 'Please enter a title.',
              }],
            })(<Input
              placeholder="e.g. Who will be the next president of the United States?"
            />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Betting End Block"
          >
            {getFieldDecorator('bettingEndBlock', {
              rules: [{
                required: true, message: 'Please enter a future block number.',
              }],
            })(<Input placeholder="e.g. 62000" />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Result Setting End Block"
          >
            {getFieldDecorator('resultSettingEndBlock', {
              rules: [{
                required: true, message: 'Please enter a future block number.',
              }],
            })(<Input placeholder="e.g. 65000" />)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Outcomes"
          >
            {getFieldDecorator('options', {
              initialValue: ['Yes', 'No', "I don't know"],
              rules: [{
                type: 'array',
                required: true,
                message: 'Please enter at least two options.',
              }],
            })(<OptionsInput />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Result Setter"
          >
            {getFieldDecorator('resultSetter', {
              rules: [{
                required: true, message: 'Please enter a valid Qtum address.',
              }],
            })(<Input placeholder="e.g. qavn7QqvdHPYKr71bNWJo4tcmcgTKaYfjM" />)}
          </FormItem>

          <FormItem {...tailFormItemLayout} className="submit-controller">
            {alertContainer}
            <Button
              type="primary"
              htmlType="submit"
              disabled={createReturn && createReturn.result}
            >Publish</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

CreateTopic.propTypes = {
  form: PropTypes.object.isRequired,
  createReturn: PropTypes.object,
  onCreateTopic: PropTypes.func,
  onClearCreateReturn: PropTypes.func,
  walletAddrs: PropTypes.array,
  walletAddrsIndex: PropTypes.number,
};

CreateTopic.defaultProps = {
  createReturn: undefined,
  onCreateTopic: undefined,
  onClearCreateReturn: undefined,
  walletAddrs: [],
  walletAddrsIndex: 0,
};

class OptionsInput extends React.Component {
  static Constants() {
    return {
      MAX_OPTION_NUMBER: 10,
    };
  }

  constructor(props) {
    super(props);

    console.log('this.props.value', this.props.value);

    const value = this.props.value || [];

    this.state = {
      value,
    };

    this.onValueChanged = this.onValueChanged.bind(this);
    // this.onAddBtnClicked = this.onAddBtnClicked.bind(this);
    // this.onDeleteBtnClicked = this.onDeleteBtnClicked.bind(this);
    // this.triggerChange = this.triggerChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps nextProps', nextProps);
    // Should be a controlled component.
    if ('value' in nextProps) {
      const { value } = nextProps;
      // this.setState({ value });
    }
  }

  onValueChanged(evt) {
    const { value } = evt.target;
    const { index } = evt.target.dataset;

    console.log(`value change: index is ${index}, value is ${value}`);

    const newValue = this.state.value;
    newValue[index] = value;

    this.setState({
      [index]: value,
    });

    // this.triggerChange(newValue);
  }

  // onAddBtnClicked(evt) {
  //   console.log('onAddBtnClicked');
  //   const numOfOptions = this.state.value.length;

  //   if (numOfOptions < OptionsInput.Constants().MAX_OPTION_NUMBER) {
  //     const newKey = numOfOptions;

  //     console.log(`onAddBtnClicked(): newKey is ${newKey}`);

  //     const newValue = this.state.value;
  //     newValue.push('');

  //     this.setState({
  //       value: newValue,
  //     });

  //     this.triggerChange(newValue);
  //   } else {
  //     console.log(`Max option number ${OptionsInput.Constants().MAX_OPTION_NUMBER} reached!`);
  //   }
  // }

  // onDeleteBtnClicked(evt) {
  //   const { index } = evt.target.dataset;

  //   const indexNumber = _.toNumber(index);
  //   console.log(`onDeleteBtnClicked: index is ${indexNumber}`);

  //   const newValues = _.filter(this.state.value, (value, idx) => idx !== indexNumber);

  //   this.setState({
  //     value: newValues,
  //   });

  //   this.triggerChange(newValues);
  // }

  // triggerChange(changedValue) {
  //   const { onChange } = this.props;

  //   if (onChange) {
  //     onChange(changedValue);
  //   }
  // }

  render() {
    console.log('render(): this.state.value', this.state.value);

    return (
      <div className="options-container">
        {_.map(this.state.value, (value, index) => (
          <div key={value} className="options-item" >
            <Input
              data-index={index}
              onChange={this.onValueChanged}
              placeholder={`# ${index + 1} option`}
              value={value}
            />
            {/* <Button data-index={index}  onClick={this.onDeleteBtnClicked} >Delete</Button> */}
          </div>))}
        {/* <Button onClick={this.onAddBtnClicked}>Add</Button> */}
      </div>
    );
  }
}

OptionsInput.propTypes = {
  // onChange: PropTypes.func,
};

OptionsInput.defaultProps = {
  // onChange: undefined,
};

const mapStateToProps = (state) => ({
  createReturn: state.Topic.get('create_return'),
  walletAddrs: state.App.get('walletAddrs'),
  walletAddrsIndex: state.App.get('walletAddrsIndex'),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateTopic: (params) => dispatch(actions.onCreate(params)),
    onClearCreateReturn: () => dispatch(actions.onClearCreateReturn()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CreateTopic));
