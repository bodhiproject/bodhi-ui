import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Radio, Input } from 'antd';
import moment from 'moment';
import _ from 'lodash';

import LayoutContentWrapper from '../components/utility/layoutWrapper';
import BalanceList from '../components/material-ui/balanceList';
import TransactionHistory from '../components/material-ui/transactionHistory';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const TAB_BALANCES = 0;
const TAB_HISTORY = 1;

class BalanceHistory extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: TAB_BALANCES,
    };

    this.renderRadioGroup = this.renderRadioGroup.bind(this);
    this.renderSearch = this.renderSearch.bind(this);
    this.renderBalances = this.renderBalances.bind(this);
    this.renderHistory = this.renderHistory.bind(this);
    this.onRadioGroupChange = this.onRadioGroupChange.bind(this);
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const { currentTab } = this.state;

    let content;
    switch (currentTab) {
      case TAB_BALANCES: {
        content = this.renderBalances();
        break;
      }
      case TAB_HISTORY: {
        content = this.renderHistory();
        break;
      }
      default: {
        throw new RangeError(`Invalid tab index ${currentTab}`);
      }
    }

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
        <Row style={{ marginTop: '32px' }}>
          {content}
        </Row>
      </LayoutContentWrapper>
    );
  }

  renderRadioGroup() {
    const radioButtonStyle = {
      height: '40px',
      width: '160px',
      lineHeight: '40px',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
    };

    return (
      <div>
        <RadioGroup defaultValue={TAB_BALANCES} size="large" onChange={this.onRadioGroupChange}>
          <RadioButton value={TAB_BALANCES} style={radioButtonStyle}>Balances</RadioButton>
          <RadioButton value={TAB_HISTORY} style={radioButtonStyle}>History</RadioButton>
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
          height: '40px',
        }}
      />
    );
  }

  renderBalances() {
    return (
      <div>
        <BalanceList header="QTUM" />
        <BalanceList header="BOT" />
      </div>
    );
  }

  renderHistory() {
    return <TransactionHistory />;
  }

  onRadioGroupChange(e) {
    this.setState({
      currentTab: e.target.value,
    });
  }
}

BalanceHistory.propTypes = {
};

BalanceHistory.defaultProps = {
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(BalanceHistory);
