import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  withStyles,
} from '@material-ui/core';
import cx from 'classnames';
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
      store,
      option,
      intl,
    } = this.props;

    const name = option.name === 'Invalid' ? intl.formatMessage(messages.invalidMsg) : option.name;
    const { isPrevResult, percent, isLast, isFirst, isExpanded, value } = option;
    const { eventPage } = store;
    const { selectedOptionIdx } = eventPage;

    return (
      <div
        className={cx(classes.eventOptionCollapse, {
          last: isLast || isExpanded(selectedOptionIdx),
          first: isFirst || isExpanded(selectedOptionIdx),
          is_result: isPrevResult,
        })}
      >
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
            <div className={classes.eventOptionProgressNum}>{percent}%<br></br><span>{isPrevResult ? intl.formatMessage(messages.oracleOptionIsPrevResultMsg) : value}</span></div>

          </div>
        </div>
      </div>
    );
  }
}

