import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

export const styles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  /* Styles applied to the dots container if `variant="dots"`. */
  dots: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    color: '#585AFA',
    fontWeight: 'bold',
  },
});

function CMobileStepper(props) {
  const {
    activeStep,
    backButton,
    classes,
    className: classNameProp,
    nextButton,
    steps,
    currentValue,
    ...other
  } = props;

  const className = classNames(
    classes.root,
    classNameProp,
  );

  return (
    <Paper square elevation={0} className={className} {...other}>
      {backButton}
      {
        <div className={classes.dots}>
          {currentValue}
        </div>
      }
      {nextButton}
    </Paper>
  );
}

CMobileStepper.propTypes = {
  /**
   * Set the active step (zero based index).
   * Defines which dot is highlighted when the variant is 'dots'.
   */
  activeStep: PropTypes.number,
  /**
   * A back button element. For instance, it can be be a `Button` or a `IconButton`.
   */
  backButton: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css-api) below for more details.
   */
  classes: PropTypes.object.isRequired,
  /**
   * A next button element. For instance, it can be be a `Button` or a `IconButton`.
   */
  nextButton: PropTypes.node,
  /**
   * The total steps.
   */
  steps: PropTypes.number.isRequired,
};

CMobileStepper.defaultProps = {
  activeStep: 0,
  backButton: undefined,
  nextButton: undefined,
};

export default withStyles(styles, { name: 'MuiMobileStepper' })(CMobileStepper);
