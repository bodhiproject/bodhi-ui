import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { Paper, withStyles } from '@material-ui/core';

import styles from './styles';
import { Row, Content, Title, ResultHistory, TransactionHistory } from '../components';
import WinningOutcome from './WinningOutcome';
import WithdrawTo from './WithdrawTo';
import Reward from './Reward';
import Options from './Options';
import Sidebar from './Sidebar';

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class WithdrawingTopic extends Component {
  componentWillUnmount() {
    this.props.store.eventPage.reset();
  }

  render() {
    const { classes, store: { eventPage, eventPage: { topic, escrowClaim, botWinnings, qtumWinnings } } } = this.props;
    return (
      <Row>
        <Content>
          <Title>{topic.name}</Title>
          <Paper className={classes.withdrawingPaper}>
            <WinningOutcome eventPage={eventPage} />
            {Boolean(escrowClaim || botWinnings || qtumWinnings) && (
              <Fragment>
                <Reward topic={topic} eventPage={eventPage} />
                <WithdrawTo />
              </Fragment>
            )}
          </Paper>
          <Options eventPage={eventPage} />
          <ResultHistory oracles={eventPage.oracles} currentEvent={topic} />
          <TransactionHistory options={topic.options} />
        </Content>
        <Sidebar topic={topic} />
      </Row>);
  }
}
