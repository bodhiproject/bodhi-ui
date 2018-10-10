import React from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Grid, withStyles } from '@material-ui/core';
import { EventWarning, ImportantNote, CurrentAllowanceNote } from 'components';

import styles from './styles';
import { Sidebar, Row, Content, Title, Button, Option, HistoryTable } from '../components';

const messages = defineMessages({
  oracleConsensusThresholdMsg: {
    id: 'oracle.consensusThreshold',
    defaultMessage: 'Consensus Threshold',
  },
  oracleSetResultExplanationMsg: {
    id: 'oracle.setResultExplanation',
    defaultMessage: 'Setting the result requires staking the Consensus Threshold amount.',
  },
});

const VotingOracle = ({ store: { eventPage, eventPage: { oracle, amountDecimal } } }) => (
  <Row>
    <Content>
      <Title>{oracle.name}</Title>
      {!oracle.isArchived && (
        <EventWarning id={eventPage.eventWarningMessageId} amount={eventPage.amount} type={eventPage.warningType} />
      )}
      <Options oracle={oracle} />
      <ConsensusThresholdNote consensusThreshold={oracle.consensusThreshold} />
      <CurrentAllowanceNote allowance={amountDecimal} />
      <VoteButton eventpage={eventPage} />
      <HistoryTable resultHistory transactionHistory />
    </Content>
    <Sidebar />
  </Row>
);

const ConsensusThresholdNote = injectIntl(({ intl, consensusThreshold }) => {
  const heading = `${intl.formatMessage(messages.oracleConsensusThresholdMsg)} ${consensusThreshold} BOT`;
  const message = intl.formatMessage(messages.oracleSetResultExplanationMsg);
  return <ImportantNote heading={heading} message={message} />;
});

const Options = withStyles(styles)(observer(({ classes, oracle: { options, isArchived, consensusThreshold } }) => (
  <Grid className={classes.optionGrid}>
    {options.map((option, i) => (
      <Option
        key={i}
        disabled={isArchived}
        option={option}
        amountPlaceholder={(consensusThreshold - option.amount).toFixed(2).toString()}
      />
    ))}
  </Grid>
)));

const VoteButton = props => {
  const { oracle, vote, isPending, buttonDisabled } = props.eventpage;
  return !oracle.isArchived && (
    <Button {...props} onClick={vote} disabled={isPending || buttonDisabled}>
      <FormattedMessage id="bottomButtonText.arbitrate" defaultMessage="Arbitrate" />
    </Button>
  );
};

export default injectIntl(inject('store')(observer(VotingOracle)));
