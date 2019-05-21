import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import styles from './styles';
import { getEndTimeCountDownString } from '../../helpers';

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class CountdownTime extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    endTime: PropTypes.number.isRequired,
  };

  render() {
    const {
      classes,
      endTime,
      store: {
        ui: {
          currentTimeUnix,
        },
      },
      intl: {
        locale,
        messages: localeMessages,
      },
    } = this.props;

    return (
      <div>
        <i className={cx(classes.icon, 'icon iconfont icon-ic_timer')}></i>
        {endTime !== undefined
          ? (
            <Fragment>
              {getEndTimeCountDownString(endTime - currentTimeUnix, locale, localeMessages)}
            </Fragment>
          )
          : <FormattedMessage id="str.end" defaultMessage="Ended" />
        }
      </div>
    );
  }
}
