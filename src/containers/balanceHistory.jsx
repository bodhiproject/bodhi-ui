import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Radio, Input, Table, Collapse, Button } from 'antd';
import moment from 'moment';
import _ from 'lodash';

import LayoutContentWrapper from '../components/utility/layoutWrapper';

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
    this.renderHeaderRow = this.renderHeaderRow.bind(this);
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
    const data = [{
      address: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
    }, {
      address: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
    }, {
      address: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
    }, {
      address: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
    }];

    const header = (
      <Row gutter={16} style={{ width: '100%', padding: '16px' }}>
        <Col span={10}>
          qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy
        </Col>
        <Col span={6}>
          123456789.1234567890
        </Col>
        <Col span={2} offset={4}>
          <Button>Deposit</Button>
        </Col>
        <Col span={2}>
          <Button>Withdraw</Button>
        </Col>
      </Row>
    );

    return (
      <Collapse defaultActiveKey={['1', '2']}>
        <Collapse.Panel key="1" header={this.renderHeaderRow('QTUM', 123456789.123456789)}>
          {this.renderBalanceRow(data)}
        </Collapse.Panel>
        <Collapse.Panel key="2" header={this.renderHeaderRow('BOT', 123456789.123456789)}>
          {this.renderBalanceRow(data)}
        </Collapse.Panel>
      </Collapse>
    );
  }

  renderHeaderRow(name, amount) {
    return (
      <Row
        gutter={16}
        style={{
          width: '100%',
          paddingLeft: '4px',
          paddingRight: '4px',
          marginTop: '8px',
          paddingBottom: '8px',
        }}
      >
        <Col span={9}>
          <p style={{ fontWeight: 'bold' }}>{name}</p>
        </Col>
        <Col span={6}>
          <p style={{ fontWeight: 'bold', marginLeft: '29px' }}>{amount}</p>
        </Col>
      </Row>
    );
  }

  renderBalanceRow(items) {
    const rows = [];
    _.each(items, (item) => {
      rows.push(<div>
        <Row gutter={16} style={{ width: '100%', padding: '16px' }}>
          <Col span={10}>
            qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy
          </Col>
          <Col span={6}>
            123456789.1234567890
          </Col>
          <Col span={2} offset={4}>
            <Button>Deposit</Button>
          </Col>
          <Col span={2}>
            <Button>Withdraw</Button>
          </Col>
        </Row>
      </div>);
    });

    return rows;
  }

  renderHistory() {
    const columns = [{
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      sorter: (a, b) => a.status < b.status ? -1 : 1,
    }, {
      title: 'Coin',
      dataIndex: 'coin',
      width: 120,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.coin < b.coin ? -1 : 1,
    }, {
      title: 'Amount',
      dataIndex: 'amount',
      width: 240,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.amount - b.amount,
    }, {
      title: 'Date',
      dataIndex: 'date',
      width: 240,
      defaultSortOrder: 'descend',
      sorter: (a, b) => moment(a.date).isBefore(b.date),
    }, {
      title: 'User',
      dataIndex: 'user',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.user < b.user ? -1 : 1,
    }];

    const data = [{
      key: '1',
      status: 'Pending',
      coin: 'QTUM',
      amount: 1111,
      user: 'user1',
    }, {
      key: '2',
      status: 'Completed',
      coin: 'QTUM',
      amount: 2222,
      user: 'user2',
    }, {
      key: '3',
      status: 'Pending',
      coin: 'BOT',
      amount: 3333,
      user: 'user3',
    }, {
      key: '4',
      status: 'Completed',
      coin: 'BOT',
      amount: 4444,
      user: 'user4',
    }];

    return (
      <Table
        columns={columns}
        dataSource={data}
      />
    );
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
