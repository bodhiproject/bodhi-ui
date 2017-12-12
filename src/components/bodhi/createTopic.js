import React, { PropTypes } from 'react';
import { Button, Checkbox, Col, DatePicker, Form, Icon, Input, Row, Select, TimePicker } from 'antd';
import moment from 'moment';

const propTypes = {
  form: PropTypes.object.isRequired,
};

const { TextArea } = Input;
const DATE_FORMAT = 'YYYY/MM/DD';

function CreateTopic({ form }) {
  return (
    <div>
      <h3>Create an event</h3>
      <Form>
        <Row>
          <Col sm={4}>Title</Col>
          <Col sm={8}>
            <Input />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>Description</Col>
          <Col sm={8}>
            <TextArea rows={4} />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>Prediction end date</Col>
          <Col sm={8}>
            <DatePicker format={DATE_FORMAT} defaultValue={moment(new Date())} />
            <TimePicker />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>Result end date</Col>
          <Col sm={8}>
            <DatePicker format={DATE_FORMAT} defaultValue={moment(new Date())} />
            <TimePicker />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>Outcomes</Col>
          <Col sm={8}>
            <Row type="flex" justify="start" align="middle">
              <Col span={20}>
                <Input
                  addonBefore={
                    form.getFieldDecorator('prefix')(<span>1</span>)
                  }
                />
              </Col>
              <Col span={4}>
                <a>
                  <Icon type="close" />
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>{/* Outcome placeholder */}</Col>
          <Col sm={8}>
            <Row type="flex" justify="start" align="middle">
              <Col span={20}>
                <Input
                  addonBefore={
                    form.getFieldDecorator('prefix')(<span>2</span>)
                  }
                />
              </Col>
              <Col span={4}>
                <a>
                  <Icon type="close" />
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>{/* Outcome add button placeholder */}</Col>
          <Col sm={8}>
            <Button type="primary">Add</Button>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>Result setter</Col>
          <Col sm={8}>
            <Input />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>{/* Placeholder */}</Col>
          <Col sm={8}>
            <Button type="primary">Publish</Button>
            <Button>Cancel</Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

CreateTopic.propTypes = propTypes;

export default Form.create()(CreateTopic);
