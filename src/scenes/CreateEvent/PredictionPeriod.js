import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages } from 'react-intl';
import { TimeCardTitle } from 'constants';
import { Section } from './components';
import DateTimeCard from './DateTimeCard';

const messages = defineMessages({
  createBetStartTimeMsg: {
    id: 'create.predictionPeriod',
    defaultMessage: 'Prediction Period',
  },
});

@inject('store')
@observer
export default class PredictionPeriod extends Component {
  render() {
    const {
      store: {
        createEvent,
        createEvent: {
          predictionPeriod,
          prediction: { startTime, endTime },
          error: { prediction: { startTime: startTimeErr, endTime: endTimeErr } },
        },
      },
    } = this.props;
    console.log('NAKA: PredictionPeriod -> render -> startTime', startTime);
    console.log('NAKA: PredictionPeriod -> render -> endTime', endTime);

    return (
      <Section title={messages.createBetStartTimeMsg} note={predictionPeriod}>
        <DateTimeCard
          title={TimeCardTitle.START_TIME}
          dateUnix={startTime}
          error={startTimeErr}
          onChange={(date) => date.isValid && (createEvent.prediction.startTime = date.unix())}
        />
        <DateTimeCard
          title={TimeCardTitle.END_TIME}
          dateUnix={endTime}
          error={endTimeErr}
          onChange={(date) => date.isValid && (createEvent.prediction.startTime = date.unix())}
        />
      </Section>
    );
  }
}
