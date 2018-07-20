import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { Dialog, DialogContent, DialogTitle as _DialogTitle } from '@material-ui/core';

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
  <Dialog fullWidth maxWidth='md' open={isOpen} onEnter={createEvent.prepareToCreateEvent} onClose={createEvent.close}>
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
  </Dialog>
));

const DialogTitle = styled(_DialogTitle)`
  padding: 0px;
`;

export default inject('store')(CreateEventDialog);
