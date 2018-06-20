import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button as _Button,
  Select,
  withStyles,
  Dialog,
  DialogContent,
  MenuItem,
} from '@material-ui/core';
import cx from 'classnames';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import { inject, observer } from 'mobx-react';

import styles from './styles';
import Tutorial0 from './components/tutorial0';
import Tutorial1 from './components/tutorial1';
import Tutorial2 from './components/tutorial2';
import Tutorial3 from './components/tutorial3';
import Tutorial4 from './components/tutorial4';
import Tutorial5 from './components/tutorial5';
import Tutorial6 from './components/tutorial6';
import TermsAndConditions from './components/termsAndConditions';

const messages = defineMessages({
  iAcceptLetsStart: {
    id: 'tutorial.iAcceptLetsStart',
    defaultMessage: 'I Accept. Let\'s Start.',
  },
  next: {
    id: 'tutorial.next',
    defaultMessage: 'Next',
  },
  previous: {
    id: 'tutorial.previous',
    defaultMessage: 'Previous',
  },
});


@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class TutorialCarouselDialog extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line
  }

  state = {
    currentIndex: 0,
    openTutorial: !JSON.parse(localStorage.getItem('tutorialDisplayed')),
  }

  components = [Tutorial0, Tutorial1, Tutorial2, Tutorial3, Tutorial4, Tutorial5, Tutorial6, TermsAndConditions]

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
    const { classes, store: { ui }, intl } = this.props;
    const { currentIndex, openTutorial } = this.state;
    const CurrentComponentName = this.components[currentIndex];

    return (
      <Dialog open={openTutorial} fullWidth maxWidth="md">
        <DialogContent className={cx(classes[`tutorialDialog${currentIndex}`], classes.tutorialDialog)}>
          <div className={classes.titleTopLine}></div>
          <Select
            className={classes.langBtn}
            name="lang"
            value={intl.locale}
            onChange={(e) => ui.changeLocale(e.target.value)}
            disableUnderline
          >
            <MenuItem value="en-US" className={classes.langugae}>English</MenuItem>
            <MenuItem value="zh-Hans-CN" className={classes.langugae}>中文</MenuItem>
            <MenuItem value="ko-KR" className={classes.langugae}>한국어</MenuItem>
          </Select>
          <div className={classes.contentWrapper}>
            <CurrentComponentName />
            <div className={classes.buttonsWrapper}>
              {currentIndex > 0 && (
                <Button onClick={this.prevSlide} msgId={messages.previous} />
              )}
              {currentIndex < this.components.length - 1 && (
                <Button onClick={this.nextSlide} msgId={messages.next} />
              )}
              {currentIndex === this.components.length - 1 && (
                <Button onClick={this.closeTutorial} msgId={messages.iAcceptLetsStart} />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

const Button = injectIntl(withStyles(styles)(({ classes, intl, msgId, ...props }) => (
  <_Button {...props} className={classes.button} variant="raised" size="medium">
    {intl.formatMessage(msgId)}
  </_Button>
)));
