import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Dialog, DialogContent, DialogActions, DialogTitle, Button, withStyles } from '@material-ui/core';
import { Clear, Create } from '@material-ui/icons';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { EventWarning as _EventWarning, ImportantNote } from 'components';
import { EventWarningType } from 'constants';

import styles from './styles';
import Title from './Title';
import CreatorDropdown from './CreatorDropdown';
import PredictionStartTime from './PredictionStartTime';
import PredictionEndTime from './PredictionEndTime';
import ResultSetStartTime from './ResultSetStartTime';
import ResultSetEndTime from './ResultSetEndTime';
import Outcomes from './Outcomes';
import ResultSetter from './ResultSetter';
import { Loading as _Loading } from '../../components/Loading';

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

const CreateEventDialog = () => (
  <Fragment>
    <Loading />
    <CreateEventDetail />
  </Fragment>
);

const Loading = withStyles(styles)(inject('store')(observer(({ classes, store: { createEvent: { loaded, isOpen } } }) => (
  <Fragment>
    <Dialog
      className={classes.createDialog}
      classes={{ paper: classes.createDialogPaper }}
      open={!loaded && isOpen}
    >
      <DialogTitle>
        <FormattedMessage id="str.pleasewait" defaultMessage="Please Wait" />
      </DialogTitle>
      <_Loading />
    </Dialog>
  </Fragment>
))));

const CreateEventDetail = withStyles(styles)(inject('store')(observer(({ classes, store: { createEvent: { loaded, isOpen } } }) => (
  <Fragment>
    <Dialog
      className={classes.createDialog}
      classes={{ paper: classes.createDialogPaper }}
      fullWidth
      maxWidth='md'
      open={loaded && isOpen}
    >
      <DialogTitle className={classes.createDialogTitle}>
        <FormattedMessage id="str.createEvent" defaultMessage="Create Event" />
      </DialogTitle>
      <DialogContent>
        <EscrowAmountNote />
        <EventWarning />
        <Title />
        <CreatorDropdown />
        <PredictionStartTime />
        <PredictionEndTime />
        <ResultSetStartTime />
        <ResultSetEndTime />
        <Outcomes />
        <ResultSetter />
      </DialogContent>
      <DialogActions className={classes.footer}>
        <CancelButton />
        <PublishButton />
      </DialogActions>
    </Dialog>
  </Fragment>
))));

const EventWarning = inject('store')(observer(({ store: { createEvent: { hasEnoughFee, warning } } }) => (
  !hasEnoughFee && <_EventWarning id={warning.id} message={warning.message} type={EventWarningType.ERROR} />
)));

const EscrowAmountNote = injectIntl(withStyles(styles)(inject('store')(observer(({ classes, intl, store: { createEvent: { escrowAmount } } }) => {
  const heading = intl.formatMessage(messages.createEscrowNoteTitleMsg, { amount: escrowAmount });
  const message = intl.formatMessage(messages.createEscrowNoteDescMsg, { amount: escrowAmount });
  return <ImportantNote className={classes.escrowAmountNote} heading={heading} message={message} />;
}))));

const CancelButton = withStyles(styles)(inject('store')(({ classes, store: { createEvent } }) => (
  <Button className={classes.cancelButton} onClick={createEvent.close} variant="raised" size="small">
    <Clear className={classes.buttonIcon} />
    <FormattedMessage id="str.cancel" defaultMessage="Cancel" />
  </Button>
)));

const PublishButton = withStyles(styles)(inject('store')(observer(({ classes, store: { createEvent } }) => (
  <Button
    onClick={createEvent.submit}
    disabled={createEvent.submitting || !createEvent.hasEnoughFee}
    color="primary"
    variant="raised"
    size="small"
  >
    <Create className={classes.buttonIcon} />
    <FormattedMessage id="create.publish" defaultMessage="Publish" />
  </Button>
))));

export default withStyles(styles)(inject('store')(observer(CreateEventDialog)));
