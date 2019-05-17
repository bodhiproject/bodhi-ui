import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Grid, withStyles } from '@material-ui/core';
import { EventWarning, ImportantNote } from 'components';

import styles from './styles';
import { Sidebar, Row, Content, Title, Button, Option, HistoryTable } from '../components';
import Leaderboard from '../components/Leaderboard';

const BettingOracle = observer(({ store: { eventPage, eventPage: { event } } }) => {
  console.log('TCL: BettingOracle -> eventPage', eventPage);
  return (
    <Row>
      <Content>
        <Title>{event.name}</Title>
        {/* {!event.unconfirmed && !event.isArchived && (
          <EventWarning id={eventPage.eventWarningMessageId} amount={eventPage.amount} type={eventPage.warningType} />
        )} */}
        <Options event={event} />
        <Fragment>
          <BetButton eventpage={eventPage} />
          <Leaderboard maxSteps={1} />
          <HistoryTable transactionHistory />
        </Fragment>
      </Content>
      <Sidebar endTime={event.betEndTime} />
    </Row>
  );
});

const Options = withStyles(styles)(observer(({ classes, event }) => (
  <Grid className={classes.optionGrid}>
    {event.results.map((option, i) => <Option key={i} option={option} disabled={event.isArchived} />)}
  </Grid>
)));

const BetButton = observer(props => {
  const { event, bet, buttonDisabled } = props.eventpage;
  return !event.isArchived && (
    <Button {...props} onClick={bet} disabled={event.isPending() || buttonDisabled}>
      <FormattedMessage id="bottomButtonText.placeBet" defaultMessage="Place Bet" />
    </Button>
  );
});

export default injectIntl(inject('store')(BettingOracle));
