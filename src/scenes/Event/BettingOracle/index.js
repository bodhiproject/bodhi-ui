import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Grid, withStyles } from '@material-ui/core';
import { EventWarning, ImportantNote } from 'components';

import styles from './styles';
import { Sidebar, Row, Content, Title, Button, Option, HistoryTable } from '../components';
import Leaderboard from '../components/Leaderboard';

const messages = defineMessages({
  unconfirmedMessage: {
    id: 'str.unconfirmed',
    defaultMessage: 'Unconfirmed',
  },
  eventUnconfirmedMessage: {
    id: 'oracle.eventUnconfirmed',
    defaultMessage: 'This created Event is unconfirmed. You cannot interact with it until it is confirmed by the blockchain.',
  },
});

const BettingOracle = observer(({ store: { eventPage, eventPage: { oracle } } }) => (
  <Row>
    <Content>
      <Title>{oracle.name}</Title>
      {!oracle.unconfirmed && !oracle.isArchived && (
        <EventWarning id={eventPage.eventWarningMessageId} amount={eventPage.amount} type={eventPage.warningType} />
      )}
      <Options oracle={oracle} />
      {oracle.unconfirmed && <EventUnconfirmedNote />}
      {!oracle.unconfirmed && (
        <Fragment>
          <BetButton eventpage={eventPage} />
          <Leaderboard maxSteps={1} />
          <HistoryTable transactionHistory />
        </Fragment>
      )}
    </Content>
    <Sidebar />
  </Row>
));

const EventUnconfirmedNote = injectIntl(({ intl: { formatMessage } }) => (
  <ImportantNote
    heading={formatMessage(messages.unconfirmedMessage)}
    message={formatMessage(messages.eventUnconfirmedMessage)}
  />
));

const Options = withStyles(styles)(observer(({ classes, oracle }) => (
  <Grid className={classes.optionGrid}>
    {oracle.options.map((option, i) => <Option key={i} option={option} disabled={oracle.isArchived} />)}
  </Grid>
)));

const BetButton = props => {
  const { oracle, unconfirmed, bet, isPending, buttonDisabled } = props.eventpage;
  return !oracle.isArchived && !unconfirmed && (
    <Button {...props} onClick={bet} disabled={isPending || buttonDisabled}>
      <FormattedMessage id="bottomButtonText.placeBet" defaultMessage="Place Bet" />
    </Button>
  );
};

export default injectIntl(inject('store')(BettingOracle));
