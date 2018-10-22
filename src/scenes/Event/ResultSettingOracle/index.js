import React from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Grid, withStyles } from '@material-ui/core';
import { EventWarning, ImportantNote, CurrentAllowanceNote } from 'components';

import styles from './styles';
import { Sidebar, Row, Content, Title, Button, Option, HistoryTable } from '../components';
import Leaderboard from '../components/Leaderboard';

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

const ResultSettingOracle = observer(({ store: { eventPage, eventPage: { oracle, amountDecimal } } }) => (
  <Row>
    <Content>
      <Title>{oracle.name}</Title>
      {!oracle.isArchived && (
        <EventWarning id={eventPage.eventWarningMessageId} amount={eventPage.amount} type={eventPage.warningType} />
      )}
      <Options oracle={oracle} />
      <MustStakeConsensusThresold consensusThreshold={oracle.consensusThreshold} />
      <CurrentAllowanceNote allowance={amountDecimal} />
      <SetResultButton eventpage={eventPage} />
      <Leaderboard />
      <HistoryTable transactionHistory />
    </Content>
    <Sidebar />
  </Row>
));

const MustStakeConsensusThresold = injectIntl(({ intl, consensusThreshold }) => {
  const heading = `${intl.formatMessage(messages.consensusThreshold)} ${consensusThreshold} BOT`;
  const message = intl.formatMessage(messages.setResultExplanation);
  return <ImportantNote heading={heading} message={message} />;
});

const Options = withStyles(styles)(observer(({ classes, oracle: { options } }) => (
  <Grid className={classes.optionGrid}>
    {options.map((option, i) => <Option key={i} option={option} amountInputDisabled />)}
  </Grid>
)));

const SetResultButton = props => {
  const { oracle, setResult, isPending, buttonDisabled } = props.eventpage;
  return !oracle.isArchived && (
    <Button {...props} onClick={setResult} disabled={isPending || buttonDisabled}>
      <FormattedMessage id="str.setResult" defaultMessage="Set Result" />
    </Button>
  );
};

export default injectIntl(inject('store')(ResultSettingOracle));
