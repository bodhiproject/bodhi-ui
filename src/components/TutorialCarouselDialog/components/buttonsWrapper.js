import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Typography, withStyles } from 'material-ui';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import cx from 'classnames';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import _ from 'lodash';

import styles from '../styles';

@injectIntl
@withStyles(styles, { withTheme: true })
export default class TutorialButtonsWrapper extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    currentIndex: PropTypes.number.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line
  }

  render() {
    const { intl, classes, currentIndex } = this.props;

    return (
      <div className={classes.buttonsWrapper}>
        {currentIndex > 0 && <Button className={classes.button} variant="raised" size="medium" onClick={this.prevSlide}>Previous</Button>}
        {currentIndex < contentLength.length - 1 && <Button className={classes.button} variant="raised" size="medium" onClick={this.nextSlide}>Next</Button>}
        {currentIndex === contentLength.length - 1 && <Button className={classes.button} variant="raised" size="medium" onClick={this.closeTutorial}>Got It. Let&apos;s Start.</Button>}
      </div>
    );
  }
}
