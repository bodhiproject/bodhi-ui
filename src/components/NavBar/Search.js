import React from 'react';
import { withStyles, Typography, TextField, Button } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import { debounce } from 'lodash';

import styles from './styles';

export const SearchButton = withStyles(styles)(inject('store')(observer(({ classes, store: { ui } }) => (
  <div className={classes.rightButtonContainer} onClick={ui.enableSearchBarMode}>
    <Button className={classes.searchButtonIcon}>
      <div className="icon iconfont icon-ic_search" />
      <Typography className={cx(classes.navButton, classes.searchBarFont)}>
        <FormattedMessage id="str.search" defaultMessage="Search" />
      </Typography>
    </Button>
  </div>
))));

export const SearchBarField = withStyles(styles)(injectIntl(inject('store')(({ intl, classes, store: { search, ui }, onSearchBarKeyDown }) => (
  <div className={classes.searchBarField}>
    <div className={`icon iconfont icon-ic_search ${classes.searchBarLeftIcon}`} />
    <TextField
      placeholder={intl.formatMessage({ id: 'search.placeholder', defaultMessage: 'Type to begin search' })}
      className={classes.searchBarTextField}
      InputProps={{
        autoFocus: true,
        disableUnderline: true,
        classes: {
          input: classes.searchBarInput,
          root: classes.searchBarInputBase,
        },
        onKeyDown: (e) => onSearchBarKeyDown(e),
        onChange: e => {
          search.phrase = e.target.value;
          debounce(search.init, 1500)();
        },
        value: search.phrase,
        inputProps: {
          id: 'searchEventInput',
        },
      }}
    >
    </TextField>
    <div className="icon iconfont icon-ic_close" onClick={ui.disableSearchBarMode} />
  </div>
))));

export default withStyles(styles, { withTheme: true })(SearchButton);
