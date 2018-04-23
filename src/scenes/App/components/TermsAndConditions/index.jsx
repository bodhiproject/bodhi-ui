import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { FormattedMessage } from 'react-intl';
import Grid from 'material-ui/Grid';
import { LinearProgress } from 'material-ui/Progress';

import AppConfig from '../../../../config/app';
import styles from './styles';
import { getLocalDateTimeString } from '../../../../helpers/utility';

@withStyles(styles, { withTheme: true })
@connect((state) => ({
}), (dispatch) => ({
}))

export default class TermsAndConditions extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;

    const tncAccepted = localStorage.getItem('termsAndConditionsAccepted');
    console.log(tncAccepted);

    return (
      <div
        className={classes.tncBg}
        style={
          {
            opacity: tncAccepted ? 0 : 1,
            display: tncAccepted ? 'none' : 'block',
          }
        }
      >
        <Grid container>
          <Grid item xs></Grid>
          <Grid item xs={8}>
            <Paper className={classes.tncWrapper}>
              {this.renderTitle()}
            </Paper>
          </Grid>
          <Grid item xs></Grid>
        </Grid>
      </div>
    );
  }

  renderTitle = () => (
    <Typography variant="title">
      <FormattedMessage id="tnc.title" defaultMessage="Bodhi Terms and Conditions" />
    </Typography>
  );
}
