import React from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages } from 'react-intl';
import moment from 'moment';
import { withStyles } from '@material-ui/core';

import { DateRow, DateItem } from './components';
import styles from './styles';

const messages = defineMessages({
  createBetTimeMsg: {
    id: 'create.betTime',
    defaultMessage: 'Prediction Time',
  },
});

const PredictionStartTime = withStyles(styles, { withTheme: true })(observer(({ classes, store: { createEvent } }) => (
  <DateRow title={messages.createBetTimeMsg}>
    <DateItem
      error={createEvent.error.prediction.startTime}
      onChange={e => moment(e.target.value).isValid && (createEvent.prediction.startTime = moment(e.target.value).utc().unix())}
      value={createEvent.prediction.startTime}
      blockNum={createEvent.blockNum.prediction.startTime}
      className={classes.firstDateItem}
      start
    />
    <DateItem
      error={createEvent.error.prediction.endTime}
      onChange={e => moment(e.target.value).isValid && (createEvent.prediction.endTime = moment(e.target.value).utc().unix())}
      value={createEvent.prediction.endTime}
      blockNum={createEvent.blockNum.prediction.endTime}
    />
  </DateRow>
)));


export default inject('store')(PredictionStartTime);
