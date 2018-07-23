/* eslint-disable */
import React from 'react';
import { observer, inject } from 'mobx-react';
import Section from './Section';
import { DateRow } from './components/DateRow';


const ResultSetStartTime = observer(({ store: { createEvent } }) => (
  <Section title='create.resultSetStartTime'>
    <DateRow
      error={createEvent.error.resultSetting.startTime}
      onChange={e => createEvent.resultSetting.startTime = e.target.value}
      value={createEvent.resultSetting.startTime}
      onBlur={createEvent.validateResultSettingStartTime}
      blockNum={createEvent.blockNum.resultSetting.startTime}
    />
  </Section>
));

export default inject('store')(ResultSetStartTime);
