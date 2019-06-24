import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Tabs, Tab, withStyles } from '@material-ui/core';
import { Card } from 'components';
import styles from './styles';
import ResultHistory from './ResultHistory';
import TransactionHistory from './TransactionHistory';

const TAB_RESULT_HISTORY = 2;
const TAB_MY_TRANSACTIONS = 1;
const TAB_ALL_TRANSACTIONS = 0;

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class HistoryTable extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  };
  state = {
    tabValue: TAB_ALL_TRANSACTIONS,
  };

  componentDidMount = () => {
    this.setState({ tabValue: this.props.resultHistory ? TAB_RESULT_HISTORY : TAB_ALL_TRANSACTIONS });
  }

  handleChange = (event, tabValue) => {
    this.setState({ tabValue });
  };

  render() {
    const { classes, intl } = this.props;
    const { tabValue } = this.state;

    return (
      <Card>
        <div className={classes.mainTableContainer}>
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            value={tabValue}
            onChange={this.handleChange}
          >
            <Tab
              value={TAB_ALL_TRANSACTIONS}
              label={intl.formatMessage({ id: 'str.allTransactions', defaultMessage: 'All Transactions' })}
              className={classes.pickerTab}
            />
            <Tab
              value={TAB_MY_TRANSACTIONS}
              label={intl.formatMessage({ id: 'str.myTransactions', defaultMessage: 'My Transactions' })}
              className={classes.pickerTab}
            />
            <Tab
              value={TAB_RESULT_HISTORY}
              label={intl.formatMessage({ id: 'str.resultHistory', defaultMessage: 'Result History' })}
              className={classes.pickerTab}
            />
          </Tabs>
          <div className={classes.subTableContainer}>
            {tabValue === TAB_ALL_TRANSACTIONS && <TransactionHistory />}
            {tabValue === TAB_MY_TRANSACTIONS && <TransactionHistory showMyTransactions />}
            {tabValue === TAB_RESULT_HISTORY && <ResultHistory />}
          </div>
        </div>
      </Card>
    );
  }
}
