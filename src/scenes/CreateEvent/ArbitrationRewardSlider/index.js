import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Slider } from '@material-ui/lab';

@inject('store')
@observer
export default class ArbitrationRewardSlider extends Component {
  onChange = (event, value) => {
    const { store: { createEvent } } = this.props;
    createEvent.arbitrationReward = value;
  }

  render() {
    const { store: { createEvent: { arbitrationReward } } } = this.props;
    return (
      <div>
        <Slider
          min={1}
          max={50}
          value={arbitrationReward}
          step={1}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
