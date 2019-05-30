import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Typography, withStyles } from '@material-ui/core';
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
    const { store: { createEvent } } = this.props;
    createEvent.arbitrationReward = value;
  }

  renderCurrentValue = () => {
    const {
      classes,
      store: { createEvent: { arbitrationReward } },
    } = this.props;
    return (
      <Typography
        className={classes.currentValue}
        color="primary"
        variant="body2"
      >
        {`${arbitrationReward}%`}
      </Typography>
    );
  };

  renderBound = (value) => (
    <Typography variant="body1" >
      {value}
    </Typography>
  );

  render() {
    const {
      classes,
      store: { createEvent: { arbitrationReward } },
    } = this.props;

    return (
      <Section column title={messages.arbitrationReward}>
        {this.renderCurrentValue()}
        <div className={classes.sliderContainer}>
          {this.renderBound(1)}
          <Slider
            className={classes.slider}
            min={1}
            max={50}
            value={arbitrationReward}
            step={1}
            onChange={this.onChange}
          />
          {this.renderBound(50)}
        </div>
      </Section>
    );
  }
}
