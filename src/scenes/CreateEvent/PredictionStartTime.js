import React from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages } from 'react-intl';
import { DateRow, Section } from './components';

const messages = defineMessages({
  createBetStartTimeMsg: {
    id: 'create.betStartTime',
    defaultMessage: 'Prediction Start Time',
  },
});

const PredictionStartTime = observer(({ store: { createEvent } }) => (
  <Section title={messages.createBetStartTimeMsg}>
    <DateRow
      error={createEvent.error.prediction.startTime}
      onChange={e => createEvent.prediction.startTime = e.target.value}
      value={createEvent.prediction.startTime}
      blockNum={createEvent.blockNum.prediction.startTime}
    />
  </Section>
));


export default inject('store')(PredictionStartTime);
