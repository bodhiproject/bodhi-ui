import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Radio, Input, Table } from 'antd';
import moment from 'moment';

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
    this.renderTable = this.renderTable.bind(this);
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
        <Row>
          {this.renderTable()}
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
          height: '40px',
        }}
        enterButton
      />
    );
  }

  renderTable() {
    const columns = [{
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status < b.status ? -1 : 1,
    }, {
      title: 'Coin',
      dataIndex: 'coin',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.coin < b.coin ? -1 : 1,
    }, {
      title: 'Amount',
      dataIndex: 'amount',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.amount - b.amount,
    }, {
      title: 'Date',
      dataIndex: 'date',
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
    const bordered = true;

    return (
      <Table
        columns={columns}
        dataSource={data}
        bordered={bordered}
        style={{
          marginTop: '32px',
        }}
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
