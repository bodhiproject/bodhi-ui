import React, { PropTypes } from 'react';
import _ from 'lodash';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import moment from 'moment';
import { withStyles } from 'material-ui/styles';

import styles from './styles';

class PredictionInfo extends React.PureComponent {
  render() {
    const { classes, oracle } = this.props;

    return (
      <div className={classes.predictionInfoWrapper}>
        {this.renderInfoBlock(
          'ENDING DATE',
          moment.unix(oracle.endTime).format('M/D/YYYY hh:mmA'),
          this.getEndingCountDown()
        )}
        {this.renderInfoBlock('FUNDING', this.getTotalFundWithToken())}
        {this.renderInfoBlock('RESULT SETTER', oracle.resultSetterQAddress)}
      </div>
    );
  }

  renderInfoBlock(label, content, highlight) {
    const { classes } = this.props;

    return (
      <Grid item xs={6} md={12} className={classes.predictionInfoBlock}>
        <Typography variant="body1">
          {label}
        </Typography>
        <Typography variant="title" className={classes.predictionInfo}>
          {content}
        </Typography>
        {
          highlight ? (
            <Typography variant="body2" color="secondary">
              {highlight}
            </Typography>) : null
        }
      </Grid>
    );
  }

  getTotalFundWithToken() {
    const { oracle } = this.props;

    const totalAmount = _.sum(oracle.amounts);

    return `${parseFloat(totalAmount.toFixed(5)).toString()} ${oracle.token}`;
  }

  getEndingCountDown() {
    const { oracle } = this.props;

    const nowunix = moment().unix();
    const unixdiff = oracle.endTime - nowunix;

    if (unixdiff < 0) {
      return 'ENDED';
    }

    const dur = moment.duration(unixdiff * 1000);

    return `${dur.days()}d ${dur.hours()}h ${dur.minutes()}m Left.`;
  }
}

PredictionInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  oracle: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PredictionInfo);
