import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withStyles, Typography } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';
import { FormattedMessage, injectIntl } from 'react-intl';
import styles from './styles';

@withRouter
@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class BackButton extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
  };

  handleClick = (url) => {
    this.props.history.push(url);
  }

  render() {
    const { classes, url } = this.props;

    return (
      <div className={classes.bottomButton} onClick={() => this.handleClick(url)}>
        <Typography color='textPrimary' className={classes.bottomButtonText}>
          <FormattedMessage id="str.seeAll" defaultMessage="See All " />
          <KeyboardArrowRight className={classes.bottomButtonIcon} />
        </Typography>
      </div>
    );
  }
}
