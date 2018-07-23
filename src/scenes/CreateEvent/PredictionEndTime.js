/* eslint-disable */
import React from 'react';
import { observer, inject } from 'mobx-react';
import Section from './Section';
import DateRow from './components/DateRow';


const PredictionEndTime = observer(({ store: { createEvent } }) => (
  <Section title='create.betEndTime'>
    <DateRow
      error={createEvent.error.prediction.endTime}
      onChange={e => createEvent.prediction.endTime = e.target.value}
      value={createEvent.prediction.endTime}
      onBlur={createEvent.validatePredictionEndTime}
      blockNum={createEvent.blockNum.prediction.endTime}
    />
  </Section>
));

export default inject('store')(PredictionEndTime);
