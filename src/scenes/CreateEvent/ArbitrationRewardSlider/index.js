import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import { Slider } from '@material-ui/lab';
import { injectIntl, defineMessages } from 'react-intl';
import styles from './styles';
import { Section } from '../components';

const messages = defineMessages({
  arbitrationReward: {
    id: 'create.arbitrationReward',
    defaultMessage: 'Arbitration Reward',
  },
});

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class ArbitrationRewardSlider extends Component {
  onChange = (event, value) => {
    this.props.store.createEvent.setArbRewardPercent(Number(value));
  }

  render() {
    const {
      classes,
      store: { createEvent: { arbRewardPercent } },
    } = this.props;
    const marks = [
      {
        value: 1,
        label: '1',
      },
      {
        value: 50,
        label: '50',
      },
    ];
    return (
      <Section column title={messages.arbitrationReward}>
        <Slider
          className={classes.slider}
          min={1}
          max={50}
          value={arbRewardPercent}
          step={1}
          onChange={this.onChange}
          valueLabelDisplay="on"
          marks={marks}
        />
      </Section>
    );
  }
}
