import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, TextField } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import moment from 'moment';

import { DateTimePickerCombo } from './DateTimePickerCombo';

export class DateRow extends Component {
  render() {
    const { error, blockNum, intl, isOpen, ...props } = this.props;
    return (
      <Fragment>
        <Grid item xs={6}>
          <DateTimePickerCombo
            fullWidth
            error={error}
            {...props}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            disabled
            placeholder="Block Number"
            value={blockNum ? `Block: ${blockNum}` : ''}
          />
        </Grid>
      </Fragment>
    );
  }
}

