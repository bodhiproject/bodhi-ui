import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { EventType } from 'constants';
import { Tabs, Tab, withStyles } from '@material-ui/core';

import styles from './styles';
import { ResultHistory, TransactionHistory } from '../';

const { UNCONFIRMED, TOPIC, ORACLE } = EventType; // eslint-disable-line

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class HistoryTable extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    // oracles: PropTypes.array.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  };
  state = {
    tabValue: 'transactionHistory',
  };

  componentDidMount = () => {
    this.setState({ tabValue: this.props.resultHistory ? 'resultHistory' : 'transactionHistory' });
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
          color="primary"
          fullWidth
          value={tabValue}
          onChange={this.handleChange}
        >
          {this.props.resultHistory && <Tab
            value='resultHistory'
            label={intl.formatMessage({ id: 'str.resultHistory', defaultMessage: 'Result History' })}
            className={classes.pickerTab}
          />}
          {this.props.transactionHistory && <Tab
            value='transactionHistory'
            label={intl.formatMessage({ id: 'str.transaction', defaultMessage: 'My Transactions' })}
            className={classes.pickerTab}
          />}
        </Tabs>
        <div className={classes.subTableContainer}>
          {tabValue === 'resultHistory' && <ResultHistory oracles={eventPage.oracles} currentEvent={currentEvent} />}
          {tabValue === 'transactionHistory' && <TransactionHistory options={currentEvent.options} />}
        </div>
      </div>
    );
  }
}
