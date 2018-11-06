import React from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, withStyles } from '@material-ui/core';
import { EventWarning, ImportantNote } from 'components';

import styles from './styles';
import { Sidebar, Row, Content, Title, Button, Option, HistoryTable } from '../components';
import Leaderboard from '../components/Leaderboard';

const FinalizingOracle = observer(({ store: { eventPage, eventPage: { oracle } } }) => (
  <Row>
    <Content>
      <Title>{oracle.name}</Title>
      {!oracle.isArchived && (
        <EventWarning id={eventPage.eventWarningMessageId} amount={eventPage.amount} type={eventPage.warningType} />
      )}
      <Options oracle={oracle} />
      {oracle.unconfirmed && <ImportantNote heading='str.unconfirmed' message='oracle.eventUnconfirmed' />}
      <FinalizeButton eventpage={eventPage} />
      <Leaderboard maxSteps={2} />
      <HistoryTable resultHistory transactionHistory />
    </Content>
    <Sidebar />
  </Row>
));

const Options = withStyles(styles)(observer(({ classes, oracle }) => (
  <Grid className={classes.optionGrid}>
    {oracle.options.map((option, i) => (
      <Option key={i} option={option} showAmountInput={false} skipExpansion />
    ))}
  </Grid>
)));

const FinalizeButton = props => {
  const { oracle, finalize, isPending, buttonDisabled } = props.eventpage;
  return !oracle.isArchived && (
    <Button {...props} onClick={finalize} disabled={isPending || buttonDisabled}>
      <FormattedMessage id="str.finalizeResult" defaultMessage="Finalize Result" />
    </Button>
  );
};

export default injectIntl(inject('store')(FinalizingOracle));
