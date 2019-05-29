import React from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages } from 'react-intl';
import moment from 'moment';
import { DateRow, Section } from './components';

const messages = defineMessages({
  createBetStartTimeMsg: {
    id: 'create.predictionPeriod',
    defaultMessage: 'Prediction Period',
  },
});

const PredictionPeriod = observer(({ store: { createEvent } }) => (
  <Section title={messages.createBetStartTimeMsg}>
    <DateRow
      error={createEvent.error.prediction.startTime}
      onChange={e => moment(e.target.value).isValid && (createEvent.prediction.startTime = moment(e.target.value).utc().unix())}
      value={createEvent.prediction.startTime}
      blockNum={createEvent.blockNum.prediction.startTime}
    />
    <DateRow
      error={createEvent.error.prediction.endTime}
      onChange={e => moment(e.target.value).isValid && (createEvent.prediction.endTime = moment(e.target.value).utc().unix())}
      value={createEvent.prediction.endTime}
      blockNum={createEvent.blockNum.prediction.endTime}
    />
  </Section>
));


export default inject('store')(PredictionPeriod);
