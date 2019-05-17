import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Grid, withStyles } from '@material-ui/core';
import { EventWarning, ImportantNote } from 'components';

import styles from './styles';
import { Sidebar, Row, Content, Title, Button, Option, HistoryTable } from '../components';
import Leaderboard from '../components/Leaderboard';

const messages = defineMessages({
  eventUnconfirmedMessage: {
    id: 'event.eventUnconfirmed',
    defaultMessage: 'This created Event is unconfirmed. You cannot interact with it until it is confirmed by the blockchain.',
  },
});

const BettingOracle = observer(({ store: { eventPage, eventPage: { event } } }) => (
  <Row>
    <Content>
      <Title>{event.name}</Title>
      {/* {!event.unconfirmed && !event.isArchived && (
        <EventWarning id={eventPage.eventWarningMessageId} amount={eventPage.amount} type={eventPage.warningType} />
      )} */}
      <Options event={event} />
      {/* {event.unconfirmed && <EventUnconfirmedNote />} */}
      {/* {!event.unconfirmed && ( */}
      <Fragment>
        <BetButton eventpage={eventPage} />
        {/* <Leaderboard maxSteps={1} /> */}
        {/* <HistoryTable transactionHistory /> */}
      </Fragment>
      {/* )} */}
    </Content>
    <Sidebar endTime={event.betEndTime} />
  </Row>
));

const EventUnconfirmedNote = injectIntl(({ intl: { formatMessage } }) => (
  <ImportantNote
    heading={formatMessage(messages.unconfirmedMessage)}
    message={formatMessage(messages.eventUnconfirmedMessage)}
  />
));

const Options = withStyles(styles)(observer(({ classes, event }) => (
  <Grid className={classes.optionGrid}>
    {console.log('123,', event)}
    {event.results.map((option, i) => <Option key={i} option={option} disabled={event.isArchived} />)}
  </Grid>
)));

const BetButton = props => {
  const { event, bet, isPending, buttonDisabled } = props.eventpage;
  return !event.isArchived && (
    <Button {...props} onClick={bet} disabled={isPending || buttonDisabled}>
      <FormattedMessage id="bottomButtonText.placeBet" defaultMessage="Place Bet" />
    </Button>
  );
};

export default injectIntl(inject('store')(BettingOracle));
