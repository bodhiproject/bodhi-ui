import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Slider } from '@material-ui/lab';

@inject('store')
@observer
export default class ArbitrationRewardSliderr extends Component {
  render() {
    return (
      <Slider min={1} max={50} value={10} />
    );
  }
}
