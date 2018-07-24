import React, { Fragment } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { Dialog, DialogContent as Content, DialogActions, DialogTitle as _DialogTitle, Button } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import { EventWarning, TxConfirmDialog, TxSentDialog, ImportantNote as _ImportantNote } from 'components';
import { Token } from 'constants';

import Title from './Title';
import CreatorDropdown from './CreatorDropdown';
import PredictionStartTime from './PredictionStartTime';
import PredictionEndTime from './PredictionEndTime';
import ResultSetStartTime from './ResultSetStartTime';
import ResultSetEndTime from './ResultSetEndTime';
import Outcomes from './Outcomes';
import ResultSetter from './ResultSetter';


const CreateEventDialog = observer(({ store: { createEvent, createEvent: { warning, hasEnoughQtum, isOpen } } }) => (
  <Fragment>
    <Dialog fullWidth maxWidth='md' open={isOpen} >
      <DialogTitle>Create an event</DialogTitle>
      {!hasEnoughQtum && <EventWarning id={warning.id} message={warning.message} type='error' />}
      <EscrowAmountNote amount={createEvent.escrowAmount} />
      <Content>
        <Title />
        <CreatorDropdown />
        <PredictionStartTime />
        <PredictionEndTime />
        <ResultSetStartTime />
        <ResultSetEndTime />
        <Outcomes />
        <ResultSetter />
      </Content>
      <Footer>
        <CancelButton createEvent={createEvent} />
        <PublishButton createEvent={createEvent} />
      </Footer>
    </Dialog>
    {createEvent.txConfirmDialogOpen && (
      <CreateEventTxConfirmDialog createEvent={createEvent} />
    )}
    {createEvent.txSentDialogOpen && (
      <TxSentDialog
        txid={createEvent.txid}
        open={createEvent.txSentDialogOpen}
        onClose={createEvent.close}
      />
    )}
  </Fragment>
));

const DialogTitle = styled(_DialogTitle)`
  padding: 0px;
`;

const EscrowAmountNote = injectIntl(({ amount, intl }) => {
  const heading = intl.formatMessage({ id: 'create.escrowNoteTitle' }, { amount });
  const message = intl.formatMessage({ id: 'create.escrowNoteDesc' }, { amount });
  return <ImportantNote heading={heading} message={message} />;
});

const Footer = styled(DialogActions)`
  margin: 18px 14px !important;
`;

const ImportantNote = styled(_ImportantNote)`
  margin-left: 35px;
  margin-bottom: ${props => props.theme.padding.xs.px};
`;

const CancelButton = ({ createEvent }) => (
  <Button onClick={createEvent.close} color='primary'>
    <FormattedMessage id="str.cancel" defaultMessage="Cancel" />
  </Button>
);

const PublishButton = observer(({ createEvent }) => (
  <Button onClick={createEvent.prepareToCreateEvent} disabled={createEvent.submitting || !createEvent.hasEnoughQtum} color="primary" variant="raised">
    <FormattedMessage id="create.publish" defaultMessage="Publish" />
  </Button>
));

const CreateEventTxConfirmDialog = injectIntl(({ createEvent, intl }) => (
  <TxConfirmDialog
    onClose={() => createEvent.txConfirmDialogOpen = false}
    onConfirm={createEvent.submit}
    txFees={createEvent.txFees}
    open={createEvent.txConfirmDialogOpen}
    txToken={Token.BOT}
    txAmount={createEvent.escrowAmount}
    txDesc={intl.formatMessage({ id: 'txConfirmMsg.create' })}
  />
));

export default inject('store')(CreateEventDialog);
