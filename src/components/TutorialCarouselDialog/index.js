import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, withStyles } from 'material-ui';
import Dialog, { DialogContent } from 'material-ui/Dialog';
import cx from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

import styles from './styles';
import graphqlActions from '../../redux/Graphql/actions';
import Tutorial0 from './components/tutorial0';
import Tutorial1 from './components/tutorial1';
import Tutorial2 from './components/tutorial2';
import Tutorial3 from './components/tutorial3';
import Tutorial4 from './components/tutorial4';
import Tutorial5 from './components/tutorial5';
import Tutorial6 from './components/tutorial6';

@injectIntl
@withStyles(styles, { withTheme: true })
export default class TutorialCarouselDialog extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  state = {
    currentIndex: 0,
    openTutorial: !JSON.parse(localStorage.getItem('tutorialDisplayed')),
  }

  components = [Tutorial0, Tutorial1, Tutorial2, Tutorial3, Tutorial4, Tutorial5, Tutorial6]

  prevSlide = () => {
    const { currentIndex } = this.state;
    if (currentIndex > 0) {
      this.setState({ currentIndex: currentIndex - 1 });
    } else {
      this.closeTutorial();
    }
  }

  nextSlide = () => {
    const { currentIndex } = this.state;
    if (currentIndex < this.components.length - 1) {
      this.setState({ currentIndex: currentIndex + 1 });
    } else {
      this.closeTutorial();
    }
  }

  closeTutorial = () => {
    this.setState({ openTutorial: false });
    localStorage.setItem('tutorialDisplayed', true);
  }

  render() {
    const { classes } = this.props;
    const { currentIndex, openTutorial } = this.state;
    const CurrentComponentName = this.components[currentIndex];

    return (
      <Dialog open={openTutorial} fullWidth maxWidth="md">
        <DialogContent className={cx(classes[`tutorialDialog${currentIndex}`], classes.tutorialDialog)}>
          <div className={classes.titleTopLine}></div>
          <CurrentComponentName />
          <div className={classes.buttonsWrapper}>
            {currentIndex > 0 && <Button className={classes.button} variant="raised" size="medium" onClick={this.prevSlide}>Previous</Button>}
            {currentIndex < this.components.length - 1 && <Button className={classes.button} variant="raised" size="medium" onClick={this.nextSlide}>Next</Button>}
            {currentIndex === this.components.length - 1 && <Button className={classes.button} variant="raised" size="medium" onClick={this.closeTutorial}>Got It. Let&apos;s Start.</Button>}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
