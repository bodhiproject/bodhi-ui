import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import { FormControl, FormHelperText } from 'material-ui/Form';
import { Field, FieldArray } from 'redux-form';
import { InputAdornment } from 'material-ui/Input';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import cx from 'classnames';
import Web3Utils from 'web3-utils';
import { withStyles } from 'material-ui/styles';

import styles from './styles';

const MIN_OPTION_NUMBER = 2;
const MAX_OPTION_NUMBER = 10;
const MAX_LEN_RESULT_HEX = 64;

const messages = defineMessages({
  required: {
    id: 'create.required',
    defaultMessage: 'Required',
  },
  resultTooLong: {
    id: 'create.resultTooLong',
    defaultMessage: 'Result name is too long.',
  },
  duplicateOutcome: {
    id: 'create.duplicateOutcome',
    defaultMessage: 'Duplicate outcomes are not allowed.',
  },
  invalidName: {
    id: 'create.invalidName',
    defaultMessage: "Cannot name the outcome 'Invalid'",
  },
  addOutcome: {
    id: 'create.addOutcome',
    defaultMessage: 'Add Outcome',
  },
  outcomeName: {
    id: 'create.outcomeName',
    defaultMessage: 'Outcome Name',
  },
});

@injectIntl
@withStyles(styles, { withTheme: true })
export default class CreateEventOutcomes extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  };

  validate = (value, allValues) => {
    const { intl } = this.props;

    // Validate not empty
    if (_.isEmpty(value)) {
      return intl.formatMessage(messages.required);
    }

    // Validate hex length
    let hexString = _.isUndefined(value) ? '' : value;
    hexString = Web3Utils.toHex(hexString).slice(2); // Remove hex prefix for length validation
    if (hexString && hexString.length > MAX_LEN_RESULT_HEX) {
      return intl.formatMessage(messages.resultTooLong);
    }

    // Validate no duplicate outcomes
    const filtered = _.filter(allValues.outcomes, (item) => item.toLowerCase() === value.toLowerCase());
    if (filtered.length > 1) {
      return intl.formatMessage(messages.duplicateOutcome);
    }

    // Validate cannot name Invalid
    if (value.toLowerCase() === 'invalid') {
      return intl.formatMessage(messages.invalidName);
    }

    return null;
  };

  renderTextField = ({
    input,
    placeholder,
    startAdornmentLabel,
    meta: { touched, error },
    ...custom
  }) => (
    <FormControl fullWidth>
      <TextField
        {...input}
        {...custom}
        fullWidth
        placeholder={placeholder}
        error={Boolean(touched && error)}
        InputProps={{
          startAdornment: startAdornmentLabel ? <InputAdornment position="start">{startAdornmentLabel}</InputAdornment> : null,
        }}
      />
      {(touched && error) && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>
  );

  renderOutcome = (outcome, index, fields) => {
    const { classes, intl } = this.props;

    return (
      <li key={`outcome-${index}`} className={classes.outcomeWrapper}>
        <Field
          fullWidth
          name={outcome}
          placeholder={intl.formatMessage(messages.outcomeName)}
          component={this.renderTextField}
          validate={[this.validate]}
          startAdornmentLabel={`#${index + 1}`}
        />
        {fields.length > MIN_OPTION_NUMBER && (
          <i
            className={cx(classes.removeOutcome, 'icon iconfont icon-close')}
            onClick={() => {
              if (fields.length > MIN_OPTION_NUMBER) {
                fields.remove(index);
              }
            }}
          />
        )}
      </li>
    );
  };

  renderOutcomeList = ({ fields }) => (
    <ul className={this.props.classes.outcomeList}>
      {fields.map(this.renderOutcome)}
      {fields.length < MAX_OPTION_NUMBER && (
        <Button
          className={this.props.classes.inputButton}
          variant="raised"
          onClick={() => {
            if (fields.length < MAX_OPTION_NUMBER) {
              fields.push('');
            }
          }}
        >
          + {this.props.intl.formatMessage(messages.addOutcome)}
        </Button>
      )}
    </ul>
  );

  render() {
    return (
      <FieldArray name={this.props.name} component={this.renderOutcomeList} />
    );
  }
}
