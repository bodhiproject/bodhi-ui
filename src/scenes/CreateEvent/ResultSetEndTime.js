/* eslint-disable */
import React from 'react';
import { observer, inject } from 'mobx-react';
import Section from './Section';
import { DateRow } from './components/DateRow';


const ResultSetEndTime = observer(({ store: { createEvent } }) => (
  <Section title='create.resultSetEndTime'>
    <DateRow
      error={createEvent.error.resultSetting.endTime}
      onChange={e => createEvent.resultSetting.endTime = e.target.value}
      value={createEvent.resultSetting.endTime}
      onBlur={createEvent.validateResultSettingEndTime}
      blockNum={createEvent.blockNum.resultSetting.endTime}
    />
  </Section>
));

export default inject('store')(ResultSetEndTime);
