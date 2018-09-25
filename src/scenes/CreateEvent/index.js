import React, { Fragment } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { Dialog, DialogContent as Content, DialogActions, DialogTitle, Button, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { EventWarning, ImportantNote as _ImportantNote } from 'components';

import styles from './styles';
import Title from './Title';
import CreatorDropdown from './CreatorDropdown';
import PredictionStartTime from './PredictionStartTime';
import PredictionEndTime from './PredictionEndTime';
import ResultSetStartTime from './ResultSetStartTime';
import ResultSetEndTime from './ResultSetEndTime';
import Outcomes from './Outcomes';
import ResultSetter from './ResultSetter';

const messages = defineMessages({
  createEscrowNoteTitleMsg: {
    id: 'create.escrowNoteTitle',
    defaultMessage: '{amount} BOT Escrow',
  },
  createEscrowNoteDescMsg: {
    id: 'create.escrowNoteDesc',
    defaultMessage: 'You will need to deposit {amount} BOT in escrow to create an event. You can withdraw it when the event is in the Withdraw stage.',
  },
});

const CreateEventDialog = ({ classes, store: { createEvent, createEvent: { warning, hasEnoughFee, isOpen } } }) => (
  <Fragment>
    <Dialog
      className={classes.createDialog}
      classes={{ paper: classes.createDialogPaper }}
      fullWidth
      maxWidth='md'
      open={isOpen}
    >
      <DialogTitle className={classes.createDialogTitle}>Create an event</DialogTitle>
      {!hasEnoughFee && <EventWarning id={warning.id} message={warning.message} type='error' />}
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
  </Fragment>
);

const EscrowAmountNote = injectIntl(withStyles(styles)(({ classes, amount, intl }) => {
  const heading = intl.formatMessage(messages.createEscrowNoteTitleMsg, { amount });
  const message = intl.formatMessage(messages.createEscrowNoteDescMsg, { amount });
  return <ImportantNote className={classes.EscrowAmountNote} heading={heading} message={message} />;
}));

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
  <Button
    onClick={createEvent.submit}
    disabled={createEvent.submitting || !createEvent.hasEnoughFee}
    color="primary"
    variant="raised"
  >
    <FormattedMessage id="create.publish" defaultMessage="Publish" />
  </Button>
));

export default withStyles(styles)(inject('store')(observer(CreateEventDialog)));
