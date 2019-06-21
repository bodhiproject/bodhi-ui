import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages } from 'react-intl';
import { TimeCardTitle } from 'constants';
import { Section } from './components';
import DateTimeCard from './DateTimeCard';

const messages = defineMessages({
  createBetEndTimeMsg: {
    id: 'create.predictionEndTime',
    defaultMessage: 'Prediction End Time',
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
        createEvent: {
          prediction: { startTime: storeStartTime, endTime: storeEndTime },
          error: { prediction: { endTime: endTimeErr } },
        },
      },
    } = this.props;
    const { startTime, endTime } = this.state;

    // Hnadle if the store times changed due to reactions
    if (storeStartTime !== startTime || storeEndTime !== endTime) {
      this.setState({
        startTime: storeStartTime,
        endTime: storeEndTime,
      });
    }

    return (
      <Section title={messages.createBetEndTimeMsg}>
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
