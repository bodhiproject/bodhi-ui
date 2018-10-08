import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { EventType } from 'constants';
import { Tabs, Tab, withStyles } from '@material-ui/core';

import styles from './styles';
import { ResultHistory, TransactionHistory } from '../';

const { TOPIC } = EventType;
const TAB_RESULT_HISTORY = 0;
const TAB_MY_TRANSACTIONS = 1;
const TAB_ALL_TRANSACTIONS = 2;

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
    const { classes, intl, store: { eventPage } } = this.props;
    const { tabValue } = this.state;
    let currentEvent;
    if (eventPage.type === TOPIC) {
      currentEvent = eventPage.topic;
    } else {
      currentEvent = eventPage.oracle;
    }

    return (
      <div className={classes.mainTableContainer}>
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          fullWidth
          value={tabValue}
          onChange={this.handleChange}
        >
          {this.props.resultHistory && <Tab
            value={TAB_RESULT_HISTORY}
            label={intl.formatMessage({ id: 'str.resultHistory', defaultMessage: 'Result History' })}
            className={classes.pickerTab}
          />}
          {this.props.transactionHistory && <Tab
            value={TAB_MY_TRANSACTIONS}
            label={intl.formatMessage({ id: 'str.myTransactions', defaultMessage: 'My Transactions' })}
            className={classes.pickerTab}
          />}
          {this.props.transactionHistory && <Tab
            value={TAB_ALL_TRANSACTIONS}
            label={intl.formatMessage({ id: 'str.allTransactions', defaultMessage: 'All Transactions' })}
            className={classes.pickerTab}
          />}
        </Tabs>
        <div className={classes.subTableContainer}>
          {tabValue === TAB_RESULT_HISTORY && <ResultHistory oracles={eventPage.oracles} currentEvent={currentEvent} />}
          {tabValue === TAB_MY_TRANSACTIONS && <TransactionHistory myTransactions options={currentEvent.options} />}
          {tabValue === TAB_ALL_TRANSACTIONS && <TransactionHistory options={currentEvent.options} />}
        </div>
      </div>
    );
  }
}
