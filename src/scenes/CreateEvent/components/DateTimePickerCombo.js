import React, { Fragment, Component } from 'react';
import { inject, observer } from 'mobx-react';
import { FormControl, FormHelperText, withStyles, Card, CardContent, Typography } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import moment from 'moment';

import styles from './styles';

import { DateTimePickerDialog } from './DateTimePickerDialog';

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export class DateTimePickerCombo extends Component {
  state = {
    isDatePickerOpen: false,
  }

  onPickerReturn = (dateTime) => {
    this.props.onChange({ target: { value: dateTime.format('YYYY-MM-DDTHH:mm') } });
    this.setState({ isDatePickerOpen: false });
  }

  render() {
    const { classes, value, fullWidth, error, intl, title } = this.props;
    const { isDatePickerOpen } = this.state;
    return (
      <Fragment>
        <FormControl fullWidth={fullWidth}>
          <Card className={classes.card} onClick={() => this.setState({ isDatePickerOpen: true })}>
            <CardContent>
              <Typography>
                {title}
              </Typography>
              <Typography variant="subtitle1">
                {moment.unix(value).format('HH:mm')}
              </Typography>
              <Typography variant="subtitle1">
                {moment.unix(value).format('MMM Do YYYY')}
              </Typography>
            </CardContent>
          </Card>
          {Boolean(error) && <FormHelperText error>{intl.formatMessage({ id: error })}</FormHelperText>}
        </FormControl>
        {isDatePickerOpen && (
          <DateTimePickerDialog
            value={value}
            onChange={this.onPickerReturn}
          />
        )}
      </Fragment>
    );
  }
}
