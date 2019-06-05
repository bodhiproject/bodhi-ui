import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  withStyles,
} from '@material-ui/core';
import { injectIntl, defineMessages } from 'react-intl';
import styles from './styles';
import Progress from '../Progress';

const messages = defineMessages({
  oracleOptionIsPrevResultMsg: {
    id: 'oracle.optionIsPrevResult',
    defaultMessage: 'This option was set as the result in the previous round',
  },
  invalidMsg: {
    id: 'invalid',
    defaultMessage: 'Invalid',
  },
});

/**
 * Component for displaying the Event options that can be selected, bet on, etc.
 */
@withRouter
@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class Option extends Component {
  static defaultProps = {
    voteAmount: 0,
  };

  render() {
    const {
      classes,
      option,
      intl,
    } = this.props;

    const name = option.name === 'Invalid' ? intl.formatMessage(messages.invalidMsg) : option.name;
    const { percent, value } = option;

    return (
      <div>
        <div className={classes.eventOptionWrapper}>
          <div className={classes.eventOptionProgress}>
            <span className={classes.overText}>
              <span>{`${name}`}</span>
            </span>
            <Progress
              color="secondary"
              invalid={name === 'Invalid'}
              variant="determinate"
              value={percent}
              className={classes.root}
            />
            <div className={classes.eventOptionProgressNum}>{percent}%<br></br><span>{value}</span></div>
          </div>
        </div>
      </div>
    );
  }
}

