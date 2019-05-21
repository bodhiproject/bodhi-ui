import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles, Typography } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import styles from './styles';

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class RaisedAmount extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    amount: PropTypes.string.isRequired,
  };

  render() {
    const {
      classes,
      amount,
    } = this.props;

    return (
      <div className={classes.container}>
        <i className={cx(classes.icon, 'icon iconfont icon-ic_token')}></i>
        <Typography variant="body1" className={classes.amountText}>
          {`${amount} NBOT`}
        </Typography>
        <Typography variant="body1">
          <FormattedMessage id="str.raised" defaultMessage="Raised" />
        </Typography>
      </div>
    );
  }
}
