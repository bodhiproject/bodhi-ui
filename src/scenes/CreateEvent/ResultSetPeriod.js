import React from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages } from 'react-intl';
import moment from 'moment';
import { TimeCardTitle } from 'constants';
import { DateRow, Section } from './components';

const messages = defineMessages({
  createResultSetStartTimeMsg: {
    id: 'create.resultSetPeriod',
    defaultMessage: 'Result Setting Period',
  },
});

const ResultSetPeriod = observer(({ store: { createEvent } }) => (
  <Section title={messages.createResultSetStartTimeMsg}>
    <DateRow
      error={createEvent.error.resultSetting.startTime}
      onChange={e => moment(e.target.value).isValid && (createEvent.resultSetting.startTime = moment(e.target.value).utc().unix())}
      value={createEvent.resultSetting.startTime}
      blockNum={createEvent.blockNum.resultSetting.startTime}
      title={TimeCardTitle.START_TIME}
    />
    <DateRow
      error={createEvent.error.resultSetting.endTime}
      onChange={e => moment(e.target.value).isValid && (createEvent.resultSetting.endTime = moment(e.target.value).utc().unix())}
      value={createEvent.resultSetting.endTime}
      blockNum={createEvent.blockNum.resultSetting.endTime}
      title={TimeCardTitle.END_TIME}
    />
  </Section>
));

export default inject('store')(ResultSetPeriod);
