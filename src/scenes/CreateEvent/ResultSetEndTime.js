import React from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages } from 'react-intl';
import { DateRow, Section } from './components';

const messages = defineMessages({
  createResultSetEndTimeMsg: {
    id: 'create.resultSetEndTime',
    defaultMessage: 'Result Setting End Time',
  },
});

const ResultSetEndTime = observer(({ store: { createEvent } }) => (
  <Section title={messages.createResultSetEndTimeMsg}>
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
