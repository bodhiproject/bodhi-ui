import React, { PropTypes } from 'react';
import Stepper, { Step, StepLabel } from 'material-ui/Stepper';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import styles from './styles';

class StepperVertRight extends React.PureComponent {
  render() {
    const { classes, steps } = this.props;

    // TODO (LIVIA): CHECK STEPS DATA STRUCUTURE

    return (
      <Stepper activeStep={steps.current} orientation="vertical" className={classes.stepperVertRightWrapper}>
        {steps.value.map((item, index) => (
          <Step key={item.title}>
            <StepLabel className={classes.stepperVertRightLabel}>
              <Typography variant="title">
                {item.title}
              </Typography>
              <Typography variant="caption">
                {item.description}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    );
  }
}

StepperVertRight.propTypes = {
  classes: PropTypes.object.isRequired,
  steps: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(StepperVertRight);
