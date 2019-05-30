import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@material-ui/core';
import { injectIntl, defineMessages } from 'react-intl';
import { map } from 'lodash';
import { Section } from '../components';

const messages = defineMessages({
  arbitrationTime: {
    id: 'create.arbitrationTime',
    defaultMessage: 'Arbitration Time',
  },
  xHoursForXNbot: {
    id: 'create.xHoursForXNbot',
    defaultMessage: '{hours} hours for {nbot} NBOT',
  },
});

@injectIntl
@inject('store')
@observer
export default class ArbitrationOptionSelector extends Component {
  onChange = (event, value) => {
    this.props.store.createEvent.setArbOptionSelected(Number(value));
  };

  renderRadioButton = (arbOption, index) => (
    <FormControlLabel
      key={index}
      value={`${index}`}
      label={this.props.intl.formatMessage(messages.xHoursForXNbot, {
        hours: arbOption.length,
        nbot: arbOption.threshold,
      })}
      control={<Radio color="primary" />}
    />
  );

  render() {
    const {
      store: { createEvent: { arbOptions, arbOptionSelected } },
    } = this.props;

    return (
      <Section column title={messages.arbitrationTime}>
        <FormControl component="fieldset">
          <RadioGroup
            name="arbitrationTime"
            value={`${arbOptionSelected}`}
            onChange={this.onChange}
          >
            {map(arbOptions, (opt, idx) => this.renderRadioButton(opt, idx))}
          </RadioGroup>
        </FormControl>
      </Section>
    );
  }
}
