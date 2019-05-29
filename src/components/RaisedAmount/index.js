import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles, Typography } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import styles from './styles';

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class RaisedAmount extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    amount: PropTypes.number.isRequired,
  };

  render() {
    const {
      classes,
      amount,
    } = this.props;

    return (
      <div className={classes.container}>
        <Typography variant="body1" className={classes.amountText}>
          Vol:
        </Typography>
        <Typography variant="body1" className={classes.amountText}>
          {`${amount} NBOT`}
        </Typography>
      </div>
    );
  }
}
