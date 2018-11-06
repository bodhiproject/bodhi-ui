import React from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages } from 'react-intl';
import moment from 'moment';
import { withStyles } from '@material-ui/core';

import styles from './styles';
import { DateRow, DateItem } from './components';

const messages = defineMessages({
  createResultSetTimeMsg: {
    id: 'create.resultSetTime',
    defaultMessage: 'Result Setting Time',
  },
});

const ResultSetStartTime = withStyles(styles, { withTheme: true })(observer(({ classes, store: { createEvent } }) => (
  <DateRow title={messages.createResultSetTimeMsg}>
    <DateItem
      error={createEvent.error.resultSetting.startTime}
      onChange={e => moment(e.target.value).isValid && (createEvent.resultSetting.startTime = moment(e.target.value).utc().unix())}
      value={createEvent.resultSetting.startTime}
      blockNum={createEvent.blockNum.resultSetting.startTime}
      start
      className={classes.firstDateItem}
    />
    <DateItem
      error={createEvent.error.resultSetting.endTime}
      onChange={e => moment(e.target.value).isValid && (createEvent.resultSetting.endTime = moment(e.target.value).utc().unix())}
      value={createEvent.resultSetting.endTime}
      blockNum={createEvent.blockNum.resultSetting.endTime}
    />
  </DateRow>
)));

export default inject('store')(ResultSetStartTime);
