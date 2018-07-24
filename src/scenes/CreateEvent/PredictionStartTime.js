import React from 'react';
import { observer, inject } from 'mobx-react';
import Section from './Section';
import { DateRow } from './components/DateRow';


const PredictionStartTime = observer(({ store: { createEvent } }) => (
  <Section title='create.betStartTime'>
    <DateRow
      error={createEvent.error.prediction.startTime}
      onChange={e => createEvent.prediction.startTime = e.target.value}
      value={createEvent.prediction.startTime}
      onBlur={createEvent.validatePredictionStartTime}
      blockNum={createEvent.blockNum.prediction.startTime}
    />
  </Section>
));


export default inject('store')(PredictionStartTime);
