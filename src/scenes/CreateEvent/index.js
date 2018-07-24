import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { Dialog, DialogContent, DialogActions, DialogTitle as _DialogTitle, Button } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

import EventWarning from '../../components/EventWarning';
import Title from './Title';
import CreatorDropdown from './CreatorDropdown';
import PredictionStartTime from './PredictionStartTime';
import PredictionEndTime from './PredictionEndTime';
import ResultSetStartTime from './ResultSetStartTime';
import ResultSetEndTime from './ResultSetEndTime';
import Outcomes from './Outcomes';
import ResultSetter from './ResultSetter';


const CreateEventDialog = observer(({ store: { createEvent, createEvent: { warning, hasEnoughQtum, isOpen } } }) => (
  <Dialog fullWidth maxWidth='md' open={isOpen} onClose={createEvent.close}>
    <DialogContent>
      <DialogTitle>Create an event</DialogTitle>
      {!hasEnoughQtum && <EventWarning id={warning.id} message={warning.message} type='error' />}
    </DialogContent>
    <DialogContent>
      <Title />
      <CreatorDropdown />
      <PredictionStartTime />
      <PredictionEndTime />
      <ResultSetStartTime />
      <ResultSetEndTime />
      <Outcomes />
      <ResultSetter />
    </DialogContent>
    <DialogActions>
      <CancelButton createEvent={createEvent} />
      <PublishButton createEvent={createEvent} />
    </DialogActions>
    {/* <CreateEventTxConfirmDialog createEvent={createEvent} /> */}
  </Dialog>
));

const DialogTitle = styled(_DialogTitle)`
  padding: 0px;
`;

const CancelButton = observer(({ createEvent }) => (
  <Button onClick={createEvent.close} color='primary'>
    <FormattedMessage id="str.cancel" defaultMessage="Cancel" />
  </Button>
));

const PublishButton = observer(({ createEvent }) => (
  <Button onClick={createEvent.prepareToCreateEvent} disabled={createEvent.submitting || !createEvent.hasEnoughQtum} color="primary" variant="raised">
    <FormattedMessage id="create.publish" defaultMessage="Publish" />
  </Button>
));

// const CreateEventTxConfirmDialog =

export default inject('store')(CreateEventDialog);
