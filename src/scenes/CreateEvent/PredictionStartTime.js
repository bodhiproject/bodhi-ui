import React from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages } from 'react-intl';
import moment from 'moment';
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
      onChange={e => moment(e.target.value).isValid && (createEvent.prediction.startTime = moment(e.target.value).utc().unix())}
      value={createEvent.prediction.startTime}
      blockNum={createEvent.blockNum.prediction.startTime}
    />
  </Section>
));


export default inject('store')(PredictionStartTime);
