import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, Icon } from 'antd';
import _ from 'lodash';

class TabBtnGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 0,
    };

    this.toggleView = this.toggleView.bind(this);
  }

  toggleView(event) {
    const { index } = event.target.dataset;
    this.setState({
      active: index,
    });
  }

  render() {
    const buttonArray = this.props.buttons.map((entry, index) => (

      <Button
        key={entry.text}
        type={index === _.toNumber(this.state.active) ? 'primary' : 'default'}
        onClick={this.toggleView}
        data-index={index}
      >
        {entry.text}
      </Button>
    ));

    return (
      <div className="tabBtnGroup">
        <Row>
          <Col xs={16}>
            <div className="viewBtnGroup">
              {buttonArray}
            </div>
          </Col>
          <Col xs={8}>
            <div className="controlBtnGroup">
              <Button
                type="default"
                onClick={this.toggleView}
              >
              Sort
                <Icon type="down-circle-o" />
              </Button>
            </div>
          </Col>
        </Row>
      </div>);
  }
}

TabBtnGroup.propTypes = {
  buttons: PropTypes.array.isRequired,
};

export default TabBtnGroup;
