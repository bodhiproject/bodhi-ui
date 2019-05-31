import React from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages } from 'react-intl';
import moment from 'moment';
import { TimeCardTitle } from 'constants';
import { DateRow, Section } from './components';

const messages = defineMessages({
  createBetStartTimeMsg: {
    id: 'create.predictionPeriod',
    defaultMessage: 'Prediction Period',
  },
});

const PredictionPeriod = observer(({ store: { createEvent, createEvent: { predictionPeriod } } }) => (
  <Section title={messages.createBetStartTimeMsg} note={predictionPeriod}>
    <DateRow
      error={createEvent.error.prediction.startTime}
      onChange={e => moment(e.target.value).isValid && (createEvent.prediction.startTime = moment(e.target.value).utc().unix())}
      value={createEvent.prediction.startTime}
      blockNum={createEvent.blockNum.prediction.startTime}
      title={TimeCardTitle.START_TIME}
    />
    <DateRow
      error={createEvent.error.prediction.endTime}
      onChange={e => moment(e.target.value).isValid && (createEvent.prediction.endTime = moment(e.target.value).utc().unix())}
      value={createEvent.prediction.endTime}
      blockNum={createEvent.blockNum.prediction.endTime}
      title={TimeCardTitle.END_TIME}
    />
  </Section>
));


export default inject('store')(PredictionPeriod);