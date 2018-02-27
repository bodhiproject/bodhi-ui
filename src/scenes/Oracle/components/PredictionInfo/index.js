import React, { PropTypes } from 'react';
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
          moment.unix(oracle.endTime).format('MM/DD/YYYY hh:mmA'),
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

    let totalAmount = 0;
    for (let i = 0; i < oracle.amounts.length; i++) {
      totalAmount += oracle.amounts[i];
    }

    return parseFloat(totalAmount.toFixed(5)).toString().concat(' ').concat(oracle.token);
  }

  getEndingCountDown() {
    const { oracle } = this.props;

    const nowunix = Math.round(new Date().getTime() / 1000);
    const unixdiff = oracle.endTime - nowunix;

    if (nowunix > oracle.endTime) {
      return 'ENDED';
    }

    const daydiff = Math.floor(unixdiff / (24 * 60 * 60)).toString();
    const hourdiff = Math.floor((unixdiff - (daydiff * 24 * 60 * 60)) / (60 * 60)).toString();
    const minutediff = Math.floor((unixdiff - (daydiff * 24 * 60 * 60) - (hourdiff * 60 * 60)) / 60).toString();

    return daydiff.concat('d ').concat(hourdiff).concat('h ').concat(minutediff).concat('m Left');
  }
}

PredictionInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  oracle: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PredictionInfo);
