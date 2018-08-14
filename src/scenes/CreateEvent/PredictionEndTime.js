import React from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages } from 'react-intl';
import moment from 'moment';
import { DateRow, Section } from './components';

const messages = defineMessages({
  createBetEndTimeMsg: {
    id: 'create.betEndTime',
    defaultMessage: 'Prediction End Time',
  },
});

const PredictionEndTime = observer(({ store: { createEvent } }) => (
  <Section title={messages.createBetEndTimeMsg}>
    <DateRow
      error={createEvent.error.prediction.endTime}
      onChange={e => moment(e.target.value).isValid && (createEvent.prediction.endTime = moment(e.target.value).utc().unix())}
      value={createEvent.prediction.endTime}
      blockNum={createEvent.blockNum.prediction.endTime}
    />
  </Section>
));

export default inject('store')(PredictionEndTime);
