import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Dialog, DialogContent, DialogActions, DialogTitle, Button, withStyles } from '@material-ui/core';
import { Clear, Create } from '@material-ui/icons';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { EventWarning as _EventWarning, ImportantNote, Loading } from 'components';
import { EventWarningType } from 'constants';
import styles from './styles';
import Title from './Title';
import PredictionPeriod from './PredictionPeriod';
import ResultSetPeriod from './ResultSetPeriod';
import Outcomes from './Outcomes';
import ResultSetter from './ResultSetter';
import ArbitrationRewardSlider from './ArbitrationRewardSlider';
import ArbitrationOptionSelector from './ArbitrationOptionSelector';

const messages = defineMessages({
  createEscrowNoteTitleMsg: {
    id: 'create.escrowNoteTitle',
    defaultMessage: '{amount} NBOT Escrow',
  },
  createEscrowNoteDescMsg: {
    id: 'create.escrowNoteDesc',
    defaultMessage: 'You will need to deposit {amount} NBOT in escrow to create an event. You can withdraw it when the event is in the Withdraw stage.',
  },
  pleaseWait: {
    id: 'str.pleasewait',
    defaultMessage: 'Please Wait',
  },
});

const EventWarning = inject('store')(observer(({ store: { createEvent: { hasEnoughFee, warning } } }) => (
  !hasEnoughFee && <_EventWarning id={warning.id} message={warning.message} type={EventWarningType.ERROR} />
)));

const EscrowAmountNote = injectIntl(withStyles(styles)(inject('store')(observer(({ classes, intl, store: { createEvent: { escrowAmount } } }) => {
  const heading = intl.formatMessage(messages.createEscrowNoteTitleMsg, { amount: escrowAmount });
  const message = intl.formatMessage(messages.createEscrowNoteDescMsg, { amount: escrowAmount });
  return <ImportantNote className={classes.escrowAmountNote} heading={heading} message={message} />;
}))));

const CancelButton = withStyles(styles)(inject('store')(({ classes, store: { createEvent } }) => (
  <Button className={classes.cancelButton} onClick={createEvent.close} variant="contained" size="small">
    <Clear className={classes.buttonIcon} />
    <FormattedMessage id="str.cancel" defaultMessage="Cancel" />
  </Button>
)));

const PublishButton = withStyles(styles)(withRouter(inject('store')(observer(({ classes, store: { createEvent }, ...props }) => (
  <Button
    onClick={() => createEvent.submit(props)}
    disabled={createEvent.submitting || !createEvent.hasEnoughFee}
    color="primary"
    variant="contained"
    size="small"
  >
    <Create className={classes.buttonIcon} />
    <FormattedMessage id="create.publish" defaultMessage="Publish" />
  </Button>
)))));

const CreateEventDialog = ({ classes, store: { createEvent: { isOpen, loaded } } }) => (
  <Dialog
    className={classes.createDialog}
    classes={{ paper: classes.createDialogPaper }}
    fullWidth={loaded}
    maxWidth='md'
    open={isOpen}
  >
    <DialogTitle className={classes.createDialogTitle}>
      <FormattedMessage id="str.createEvent" defaultMessage="Create Event" />
    </DialogTitle>
    <DialogContent>
      {loaded ? (
        <Fragment>
          <EscrowAmountNote />
          <EventWarning />
          <Title />
          <PredictionPeriod />
          <ResultSetPeriod />
          <Outcomes />
          <ResultSetter />
          <ArbitrationRewardSlider />
          <ArbitrationOptionSelector />
        </Fragment>
      ) : (
        <Loading text={messages.pleaseWait} />
      )}
    </DialogContent>
    {loaded && (
      <DialogActions className={classes.footer}>
        <CancelButton />
        <PublishButton />
      </DialogActions>
    )}
  </Dialog>
);

export default withStyles(styles)(inject('store')(observer(CreateEventDialog)));
