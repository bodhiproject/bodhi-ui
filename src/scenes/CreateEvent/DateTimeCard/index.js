import React, { Component, useState } from 'react';
import { inject, observer } from 'mobx-react';
import {
  FormControl,
  FormHelperText,
  Grid,
  Card,
  CardContent,
  Typography,
  withStyles,
} from '@material-ui/core';
import { injectIntl, defineMessages } from 'react-intl';
import { DateTimePicker } from 'components';
import styles from '../styles';

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class DateTimeCard extends Component {
  renderErrorText = () => this.props.error && (
    <FormHelperText error>
      {this.props.intl.formatMessage({ id: this.props.error })}
    </FormHelperText>
  )

  render() {
    const {
      classes,
      store: { createEvent, createEvent: { arbOptions } },
      title,
    } = this.props;
    // const [selectedDate, handleDateChange] = useState(new Date());

    return (
      <Grid container direction="row" alignItems="center">
        <Grid item xs={10} sm={8}>
          <FormControl fullWidth>
            <Card className={classes.card}>
              <CardContent>
                <Typography>
                  {title}
                </Typography>
                <DateTimePicker />
              </CardContent>
            </Card>
            {this.renderErrorText()}
          </FormControl>
        </Grid>
      </Grid>
    );
  }
}
