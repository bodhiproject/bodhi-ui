import React, { PropTypes } from 'react';
import Stepper, { Step, StepLabel } from 'material-ui/Stepper';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import styles from './styles';

class StepperVertRight extends React.PureComponent {
  render() {
    const { classes } = this.props;

    return (
      <Stepper activeStep={1} orientation="vertical" className={classes.stepperVertRightWrapper}>
        <Step key="labellabel">
          <StepLabel className={classes.stepperVertRightLabel}>
            <Typography variant="title">
              Created
            </Typography>
            <Typography variant="caption">
              02/01/2018 10:40:52
            </Typography>
          </StepLabel>
        </Step>
        <Step key="labellabel">
          <StepLabel className={classes.stepperVertRightLabel}>
            <Typography variant="title">
              Predicting
            </Typography>
          </StepLabel>
        </Step>
        <Step key="labellabel">
          <StepLabel className={classes.stepperVertRightLabel}>
            <Typography variant="title">
              Result Setting
            </Typography>
            <Typography variant="caption">
              02/01/2018 10:40:52
            </Typography>
          </StepLabel>
        </Step>
        <Step key="labellabel">
          <StepLabel className={classes.stepperVertRightLabel}>
            <Typography variant="title">
              Predicting
            </Typography>
          </StepLabel>
        </Step>
      </Stepper>
    );
  }
}

StepperVertRight.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(StepperVertRight);
