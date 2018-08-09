import React from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages } from 'react-intl';
import { DateRow, Section } from './components';

const messages = defineMessages({
  createResultSetStartTimeMsg: {
    id: 'create.resultSetStartTime',
    defaultMessage: 'Result Setting Start Time',
  },
});

const ResultSetStartTime = observer(({ store: { createEvent } }) => (
  <Section title={messages.createResultSetStartTimeMsg}>
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
