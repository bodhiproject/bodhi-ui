import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withStyles, Button } from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './styles';

@withRouter
@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class BackButton extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;

    return (
      <Button variant="raised" size="small" className={classes.button} onClick={this.onBackClick}>
        <ChevronLeft />
        <FormattedMessage id="str.back" defaultMessage="Back" />
      </Button>
    );
  }

  onBackClick = () => {
    const { history, store: { ui: { location } } } = this.props;
    history.push(location);
  };
}
