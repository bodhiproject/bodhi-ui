// @inheritedComponent Paper

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { withStyles, Paper } from '@material-ui/core';

export const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.padding.spaceX,
  },
  /* Styles applied to the root element if `position="bottom"`. */
  positionBottom: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.mobileStepper,
  },
  /* Styles applied to the root element if `position="top"`. */
  positionTop: {
    // position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.mobileStepper,
  },
  /* Styles applied to the root element if `position="static"`. */
  positionStatic: {},
  /* Styles applied to the dots container if `variant="dots"`. */
  dots: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    color: '#585AFA',
    fontWeight: 'bold',
    margin: '0 auto',
    padding: `${theme.padding.spaceX} 0px`,
  },
  /* Styles applied to each dot if `variant="dots"`. */
  dot: {
    backgroundColor: theme.palette.action.disabled,
    borderRadius: '50%',
    width: 8,
    height: 8,
    margin: '0 2px',
  },
  /* Styles applied to a dot if `variant="dots"` and this is the active step. */
  dotActive: {
    backgroundColor: theme.palette.primary.main,
  },
  /* Styles applied to the Linear Progress component if `variant="progress"`. */
  progress: {
    width: '50%',
  },
});

function CMobileStepper(props) {
  const {
    activeStep,
    backButton,
    classes,
    className: classNameProp,
    LinearProgressProps,
    nextButton,
    position,
    steps,
    variant,
    currentValue,
    ...other
  } = props;

  const className = cx(classes.root, classNameProp);

  return (
    <Paper square elevation={0} className={className} {...other}>
      {steps > 1 && backButton}
      <div className={classes.dots}>
        {currentValue}
      </div>
      {steps > 1 && nextButton}
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
   * Set the positioning type.
   */
  position: PropTypes.oneOf(['bottom', 'top', 'static']),
  /**
   * The total steps.
   */
  steps: PropTypes.number.isRequired,
  /**
   * The variant to use.
   */
  variant: PropTypes.oneOf(['text', 'dots', 'progress']),
};

CMobileStepper.defaultProps = {
  activeStep: 0,
  position: 'bottom',
  variant: 'dots',
  backButton: undefined,
  nextButton: undefined,
};

export default withStyles(styles, { name: 'MuiMobileStepper' })(CMobileStepper);
