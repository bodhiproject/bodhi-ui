import React from 'react';
import { observer, inject } from 'mobx-react';
import { DateRow, Section } from './components';


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
