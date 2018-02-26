import React, { PropTypes } from 'react';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import styles from './styles';

class PredictionInfo extends React.PureComponent {
  render() {
    const { classes } = this.props;

    return (
      <Grid item xs={6} md={12} className={classes.predictionInfoWrapper}>
        <Typography variant="body1">
          ENDING DATE
        </Typography>
        <Typography variant="title" className={classes.predictionInfo}>
          01/02/2018 15:00
        </Typography>
        <Typography variant="body2" color="secondary">
          01d 22d  56s Left
        </Typography>
      </Grid>
    );
  }
}

PredictionInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PredictionInfo);
