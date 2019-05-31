import React, { Component } from 'react';
import { withStyles, Typography, Button } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import styles from './styles';

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class SearchButton extends Component {
  render() {
    const {
      classes,
      store: { ui },
    } = this.props;

    return (
      <div
        className={classes.rightButtonContainer}
        onClick={ui.enableSearchBarMode}
      >
        <Button className={classes.searchButtonIcon}>
          <div className="icon iconfont icon-ic_search" />
          <Typography className={cx(classes.navButton, classes.searchBarFont)}>
            <FormattedMessage id="str.search" defaultMessage="Search" />
          </Typography>
        </Button>
      </div>
    );
  }
}
