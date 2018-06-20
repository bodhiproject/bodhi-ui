import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import { Grid, FormControl, FormHelperText, TextField } from '@material-ui/core';
import { Field } from 'redux-form';

import { calculateBlock } from '../../../../helpers/utility';
import { defaults } from '../../../../config/app';


const messages = defineMessages({
  datePast: {
    id: 'create.datePast',
    defaultMessage: 'Cannot be in the past',
  },
});

@injectIntl
@connect((state) => ({
  syncBlockNum: state.App.get('syncBlockNum'),
  averageBlockTime: state.App.get('averageBlockTime'),
}))
export default class CreateEventDatePicker extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    syncBlockNum: PropTypes.number,
    averageBlockTime: PropTypes.number,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  };

  static defaultProps = {
    syncBlockNum: undefined,
    averageBlockTime: defaults.averageBlockTime,
  };

  validateTimeAfterNow = (value) => {
    const { intl } = this.props;
    const valueTime = moment(value);
    const now = moment();

    if (_.isUndefined(valueTime) || now.unix() > valueTime.unix()) {
      return intl.formatMessage(messages.datePast);
    }

    return null;
  };

  renderDateTimePicker = ({
    input,
    meta: { touched, error },
    ...custom
  }) => {
    // calculate block num if input value is not empty
    let blockNum = '';

    if (!input.value || input.value !== '') {
      const {
        syncBlockNum,
        averageBlockTime,
      } = this.props;

      const localDate = moment(input.value).local();
      blockNum = calculateBlock(syncBlockNum, localDate, averageBlockTime);
    }

    return (
      <Grid item container xs={12}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <TextField
              {...input}
              {...custom}
              fullWidth
              type="datetime-local"
              error={Boolean(touched && error)}
            />
            {touched && error && <FormHelperText error>{error}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            disabled
            placeholder="Block Number"
            value={blockNum ? `Block: ${blockNum}` : ''}
          />
        </Grid>
      </Grid>
    );
  };

  render() {
    const { name } = this.props;

    return (
      <Field
        name={name}
        validate={[this.validateTimeAfterNow]}
        component={this.renderDateTimePicker}
      />
    );
  }
}
