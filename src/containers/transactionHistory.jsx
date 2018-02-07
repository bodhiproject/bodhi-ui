import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Radio, Input } from 'antd';

import LayoutContentWrapper from '../components/utility/layoutWrapper';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
// const { Search } = Input.Search;

class TransactionHistory extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.renderRadioGroup = this.renderRadioGroup.bind(this);
    this.renderSearch = this.renderSearch.bind(this);
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    return (
      <LayoutContentWrapper className="horizontalWrapper" style={{ minHeight: '100vh' }}>
        <Row gutter={16} style={{ width: '100%' }}>
          <Col span={12}>
            {this.renderRadioGroup()}
          </Col>
          <Col span={6} offset={6}>
            {this.renderSearch()}
          </Col>
        </Row>
      </LayoutContentWrapper>
    );
  }

  renderRadioGroup() {
    const radioButtonStyle = {
      height: '50px',
      width: '216px',
      'line-height': '50px',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
    };

    return (
      <div>
        <RadioGroup defaultValue="balance" size="large">
          <RadioButton value="balance" style={radioButtonStyle}>Balance</RadioButton>
          <RadioButton value="history" style={radioButtonStyle}>Transaction History</RadioButton>
        </RadioGroup>
      </div>
    );
  }

  renderSearch() {
    return (
      <Input.Search
        size="large"
        placeholder="Search"
        onSearch={(value) => console.log(value)}
        style={{
          width: '100%',
          height: '50px',
        }}
        enterButton
      />
    );
  }
}

TransactionHistory.propTypes = {
};

TransactionHistory.defaultProps = {
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistory);
