import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { Paper, withStyles } from '@material-ui/core';

import styles from './styles';
import { Row, Content, Title, HistoryTable } from '../components';
import WinningOutcome from './WinningOutcome';
import WithdrawTo from './WithdrawTo';
import Reward from './Reward';
import Options from './Options';
import Sidebar from './Sidebar';
import Leaderboard from '../components/Leaderboard';

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class WithdrawingTopic extends Component {
  componentWillUnmount() {
    this.props.store.eventPage.reset();
  }

  render() {
    const { classes, store: { eventPage, eventPage: { topic, escrowClaim, nbotWinnings, nakaWinnings } } } = this.props;
    return (
      <Row>
        <Content>
          <Title>{topic.name}</Title>
          <Paper className={classes.withdrawingPaper}>
            <WinningOutcome eventPage={eventPage} />
            {Boolean(escrowClaim || nbotWinnings || nakaWinnings) && (
              <Fragment>
                <Reward topic={topic} eventPage={eventPage} />
                <WithdrawTo />
              </Fragment>
            )}
          </Paper>
          <Options eventPage={eventPage} />
          <Leaderboard maxSteps={3} />
          <HistoryTable resultHistory transactionHistory />
        </Content>
        <Sidebar topic={topic} />
      </Row>);
  }
}
