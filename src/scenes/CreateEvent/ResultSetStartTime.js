import React from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages } from 'react-intl';
import moment from 'moment';
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
      onChange={e => moment(e.target.value).isValid && (createEvent.resultSetting.startTime = moment(e.target.value).utc().unix())}
      value={createEvent.resultSetting.startTime}
      blockNum={createEvent.blockNum.resultSetting.startTime}
    />
  </Section>
));

export default inject('store')(ResultSetStartTime);
