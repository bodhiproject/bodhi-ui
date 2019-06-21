import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages } from 'react-intl';
import { TimeCardTitle } from 'constants';
import { Section } from './components';
import DateTimeCard from './DateTimeCard';

const messages = defineMessages({
  createResultSetStartTimeMsg: {
    id: 'create.resultSetPeriod',
    defaultMessage: 'Result Setting Period',
  },
});

@inject('store')
@observer
export default class ResultSetPeriod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: props.store.createEvent.resultSetting.startTime,
      endTime: props.store.createEvent.resultSetting.endTime,
    };
  }

  onStartTimeChange = (date) => {
    this.setState({ startTime: date.unix() });
    this.props.store.createEvent.resultSetting.startTime = date.unix();
  }

  onEndTimeChange = (date) => {
    this.setState({ endTime: date.unix() });
    this.props.store.createEvent.resultSetting.endTime = date.unix();
  }

  render() {
    const {
      store: {
        createEvent: {
          resultSettingPeriod,
          resultSetting: { startTime: storeStartTime, endTime: storeEndTime },
          error: { resultSetting: { startTime: startTimeErr } },
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
      <Section
        title={messages.createResultSetStartTimeMsg}
        note={resultSettingPeriod}
      >
        <DateTimeCard
          title={TimeCardTitle.START_TIME}
          dateUnix={startTime}
          error={startTimeErr}
          onChange={this.onStartTimeChange}
        />
      </Section>
    );
  }
}
