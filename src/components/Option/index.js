import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  withStyles,
} from '@material-ui/core';
import { injectIntl, defineMessages } from 'react-intl';
import styles from './styles';
import Progress from '../Progress';
import { toFixed } from '../../helpers/utility';

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
            <div className={classes.textWrapper}>
              <span className={classes.overText}>
                {`${name}`}
              </span>
              <div className={classes.eventOptionProgressNum}>{`${percent}%`}<br></br><span>{`${toFixed(value)} NBOT`}</span></div>
            </div>
            <Progress
              color="secondary"
              invalid={name === 'Invalid'}
              variant="determinate"
              value={percent}
              className={classes.root}
            />
          </div>
        </div>
      </div>
    );
  }
}

