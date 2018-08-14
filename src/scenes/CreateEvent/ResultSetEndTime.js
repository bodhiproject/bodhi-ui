import React from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages } from 'react-intl';
import moment from 'moment';
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
      onChange={e => moment(e.target.value).isValid && (createEvent.resultSetting.endTime = moment(e.target.value).utc().unix())}
      value={createEvent.resultSetting.endTime}
      blockNum={createEvent.blockNum.resultSetting.endTime}
    />
  </Section>
));

export default inject('store')(ResultSetEndTime);
