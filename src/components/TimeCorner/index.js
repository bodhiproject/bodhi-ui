import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import styles from './styles';
import { getEndTimeCornerString } from '../../helpers';

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class TimeCorner extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    endTime: PropTypes.number,
  };
  static defaultProps = {
    endTime: undefined,
  }

  renderCorner = () => {
    const {
      classes,
      endTime,
    } = this.props;
    const time = getEndTimeCornerString(endTime);
    return (
      <div>
        <div>{time[0]}</div>
        <span className={classes.badge}>{time[1]}</span>
      </div>
    );
  }

  render() {
    const {
      classes,
      endTime,
    } = this.props;

    return (
      <div className={classes.container}>
        {endTime !== undefined
          ? (
            <div variant="body1">
              {this.renderCorner()}
            </div>
          )
          : (
            <div variant="body1">
              <FormattedMessage id="str.end" defaultMessage="Ended" />
            </div>
          )
        }
      </div>
    );
  }
}
