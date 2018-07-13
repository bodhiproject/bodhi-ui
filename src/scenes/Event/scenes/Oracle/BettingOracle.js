/* eslint-disable */
import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid } from '@material-ui/core';
import { EventWarning, ImportantNote } from 'components';
import Transactions from '../../components/EventTxHistory';
import { Row, Content, Title, Button, Option, OracleTxConfirmDialog } from './components';
import { Sidebar } from './Sidebar';


const BettingOracle = observer(({ store: { oraclePage, oraclePage: { oracle } } }) => (
  <Row>
    <Content>
      <Title>{oracle.name}</Title>
      {!oracle.unconfirmed && <EventWarning id={oraclePage.eventWarningMessageId} amount={oraclePage.amount} type={oraclePage.warningType} />}
      <Options oracle={oracle} />

      {(!oracle.unconfirmed || oracle.phase !== 'UNCONFIRMED') && (
        <Fragment>
          {!oracle.isArchived && <BetButton onClick={oraclePage.prepareBet} disabled={oraclePage.isPending} />}
          {/* <EventResultHistory oracles={oracles} /> ONLY VOTE & FINALIZE */}
          <Transactions type='oracle' options={oracle.options} />
        </Fragment>
      )}
    </Content>
    <Sidebar oracle={oracle} />
    <OracleTxConfirmDialog id='txConfirmMsg.bet' />
  </Row>
));

const EventUnconfirmedNote = injectIntl(({ intl: { formatMessage } }) => (
  <ImportantNote heading={formatMessage({ id: 'str.unconfirmed' })} message={formatMessage({ id: 'oracle.eventUnconfirmed' })} />
));

const Options = observer(({ oracle }) => (
  <Grid item xs={12} lg={9}>
    {oracle.options.map((option, i) => <Option key={i} option={option} />)}
  </Grid>
));

const BetButton = props => <Button {...props}><FormattedMessage id="bottomButtonText.placeBet" defaultMessage="Place Bet" /></Button>;

export default injectIntl(inject('store')(BettingOracle));
