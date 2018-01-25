/* eslint-disable arrow-body-style */

import React, { PropTypes } from 'react';
import { Form, Input, Icon, Button } from 'antd';
import Web3Utils from 'web3-utils';

const MAX_LEN_HEX = 64;

const FormItem = Form.Item;
let uuid = 2;

export class DynamicFieldSet extends React.Component {
  constructor(props) {
    super(props);

    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
  }

  remove(k) {
    const { form } = this.props;

    // can use data-binding to get
    const keys = form.getFieldValue('keys');

    // Need at least two results
    if (keys.length === 2) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter((key) => key !== k),
    });
  }

  add() {
    const { form } = this.props;

    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid += 1;

    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  validateLength(rule, value, callback) {
    const hexString = Web3Utils.toHex(value).slice(2);
    if (hexString && hexString.length <= MAX_LEN_HEX) {
      callback();
    } else {
      callback('Result name is too long.');
    }
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 28 },
        sm: { span: 18 },
      },
    };

    getFieldDecorator('keys', { initialValue: ['0', '1'] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...formItemLayoutWithOutLabel}
          required={false}
          key={k}
        >
          {getFieldDecorator(`results[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Input the result name or delete this field.',
              },
              {
                validator: this.validateLength,
              },
            ],
          })(<Input placeholder={`Result #${index + 1}`} style={{ width: '80%', marginRight: 8 }} />)}
          {keys.length > 2 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
          ) : null}
        </FormItem>
      );
    });

    return (
      <Form>
        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          {keys.length < 10 ? (
            <Button type="dashed" onClick={this.add} style={{ width: '80%' }}>
              <Icon type="plus" />Add Result
            </Button>
          ) : null}
        </FormItem>
      </Form>
    );
  }
}

DynamicFieldSet.propTypes = {
  form: PropTypes.object.isRequired,
};

DynamicFieldSet.defaultProps = {
};
