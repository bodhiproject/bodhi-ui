import React from 'react';
import { withStyles, Typography } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';

import styles from './styles';


const SearchButton = ({ classes, store: { ui } }) => (
  <div className={classes.rightButtonContainer} onClick={ui.enableSearchBarMode}>
    <div className="icon iconfont icon-ic_search" />
    <Typography className={cx(classes.navText, classes.searchBarFont)}>
      <FormattedMessage id="str.search" defaultMessage="Search" />
    </Typography>
  </div>
);

export default withStyles(styles, { withTheme: true })(inject('store')(observer((SearchButton))));
