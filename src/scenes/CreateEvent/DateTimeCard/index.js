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

const DateTimeCard = ({ classes, intl, title, dateUnix, error, onChange }) => (
  <Grid container direction="row" alignItems="center">
    <Grid item xs={11} md={9} lg={7}>
      <FormControl fullWidth>
        <Card className={classes.card}>
          <CardContent>
            <Typography>{title}</Typography>
            <DateTimePicker dateUnix={dateUnix} onChange={onChange} />
            {error && (
              <FormHelperText error>
                {intl.formatMessage({ id: error })}
              </FormHelperText>
            )}
          </CardContent>
        </Card>
      </FormControl>
    </Grid>
  </Grid>
);

export default withStyles(styles, { withTheme: true })(injectIntl(DateTimeCard));
