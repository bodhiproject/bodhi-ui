import React from 'react';
import {
  FormControl,
  FormHelperText,
  Grid,
  Card,
  CardContent,
  Typography,
  withStyles,
} from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { DateTimePicker } from 'components';
import styles from '../styles';

const DateTimeCard = ({ classes, title, dateUnix, error, onChange }) => {
  console.log('DateTimeCard render', dateUnix);
  return (
    <Grid container direction="row" alignItems="center">
      <Grid item xs={10} sm={8}>
        <FormControl fullWidth>
          <Card className={classes.card}>
            <CardContent>
              <Typography>{title}</Typography>
              <DateTimePicker
                dateUnix={dateUnix}
                onChange={onChange}
              />
            </CardContent>
          </Card>
          {error && (
            <FormHelperText error>
              {this.props.intl.formatMessage({ id: error })}
            </FormHelperText>
          )}
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles, { withTheme: true })(injectIntl(DateTimeCard));
