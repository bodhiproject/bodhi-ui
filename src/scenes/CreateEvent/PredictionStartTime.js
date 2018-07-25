import React from 'react';
import { observer, inject } from 'mobx-react';
import { DateRow, Section } from './components';


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
