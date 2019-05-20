import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Grid, withStyles } from '@material-ui/core';
import { EventWarning, ImportantNote } from 'components';

import styles from './styles';
import { Sidebar, Row, Content, Title, Button, Option, HistoryTable } from '../components';
import Leaderboard from '../components/Leaderboard';
import { satoshiToDecimal } from '../../../helpers/utility';

const messages = defineMessages({
  consensusThreshold: {
    id: 'oracle.consensusThreshold',
    defaultMessage: 'Consensus Threshold',
  },
  setResultExplanation: {
    id: 'oracle.setResultExplanation',
    defaultMessage: 'Setting the result requires staking the Consensus Threshold amount.',
  },
});

const BettingOracle = observer(({ store: { eventPage, eventPage: { event } } }) => (
  <Row>
    <Content>
      <Title>{event.name}</Title>
      {!event.isArchived && (
        <EventWarning id={eventPage.eventWarningMessageId} amount={String(eventPage.amount)} type={eventPage.warningType} />
      )}
      <Options event={event} amountInputDisabled={eventPage.isResultSetting} />
      {eventPage.isResultSetting && <MustStakeConsensusThresold consensusThreshold={satoshiToDecimal(event.consensusThreshold)} />}
      <Fragment>
        <BetButton eventpage={eventPage} />
        <Leaderboard maxSteps={1} />
        <HistoryTable transactionHistory />
      </Fragment>
    </Content>
    <Sidebar endTime={event.betEndTime} />
  </Row>
));

const Options = withStyles(styles)(observer(({ classes, event, amountInputDisabled }) => (
  <Grid className={classes.optionGrid}>
    {event.results.map((option, i) => <Option key={i} option={option} disabled={event.isArchived} amountInputDisabled={amountInputDisabled} />)}
  </Grid>
)));

const BetButton = observer(props => {
  const { event, buttonDisabled, buttonExtendProps: { buttonFunc, localeId, localeDefaultMessage } } = props.eventpage;
  return !event.isArchived && (
    <Button {...props} onClick={buttonFunc} disabled={event.isPending() || buttonDisabled}>
      <FormattedMessageFixed id={localeId} defaultMessage={localeDefaultMessage} />
    </Button>
  );
});

const MustStakeConsensusThresold = injectIntl(({ intl, consensusThreshold }) => {
  const heading = `${intl.formatMessage(messages.consensusThreshold)} ${consensusThreshold} NBOT`;
  const message = intl.formatMessage(messages.setResultExplanation);
  return <ImportantNote heading={heading} message={message} />;
});

function FormattedMessageFixed(props) {
  return <FormattedMessage {...props} />;
}

export default injectIntl(inject('store')(BettingOracle));
