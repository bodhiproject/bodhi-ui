import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  withStyles,
} from '@material-ui/core';
import { injectIntl, defineMessages } from 'react-intl';
import styles from './styles';
import { Section } from '../components';

const messages = defineMessages({
  arbitrationTime: {
    id: 'create.arbitrationTime',
    defaultMessage: 'Arbitration Time',
  },
});

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class ArbitrationTimeSelector extends Component {
  renderRadioButton = (value) => (
    <FormControlLabel
      label={value}
      value={value}
      control={<Radio color="primary" />}
    />
  );

  render() {
    const {
      classes,
      store: { createEvent: { arbitrationReward } },
    } = this.props;

    return (
      <Section column title={messages.arbitrationTime}>
        <FormControl component="fieldset">
          <RadioGroup name="arbitrationTime">
            {this.renderRadioButton('First')}
            {this.renderRadioButton('Second')}
            {this.renderRadioButton('Third')}
            {this.renderRadioButton('Fourth')}
          </RadioGroup>
        </FormControl>
      </Section>
    );
  }
}
