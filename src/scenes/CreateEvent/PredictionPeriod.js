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
  constructor(props) {
    super(props);
    this.state = {
      startTime: props.store.createEvent.prediction.startTime,
      endTime: props.store.createEvent.prediction.endTime,
    };
  }

  onStartTimeChange = (date) => {
    this.setState({ startTime: date.unix() });
    this.props.store.createEvent.prediction.startTime = date.unix();
  }

  onEndTimeChange = (date) => {
    this.setState({ endTime: date.unix() });
    this.props.store.createEvent.prediction.endTime = date.unix();
  }

  render() {
    const {
      store: {
        createEvent,
        createEvent: {
          predictionPeriod,
          // prediction: { startTime, endTime },
          error: { prediction: { startTime: startTimeErr, endTime: endTimeErr } },
        },
      },
    } = this.props;
    const { startTime, endTime } = this.state;
    console.log('NAKA: PredictionPeriod -> render -> startTime', startTime);
    console.log('NAKA: PredictionPeriod -> render -> endTime', endTime);

    return (
      <Section title={messages.createBetStartTimeMsg} note={predictionPeriod}>
        <DateTimeCard
          title={TimeCardTitle.START_TIME}
          dateUnix={startTime}
          error={startTimeErr}
          onChange={this.onStartTimeChange}
        />
        <DateTimeCard
          title={TimeCardTitle.END_TIME}
          dateUnix={endTime}
          error={endTimeErr}
          onChange={this.onEndTimeChange}
        />
      </Section>
    );
  }
}
