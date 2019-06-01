import React, { Component } from 'react';
import { withStyles, TextField } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import styles from './styles';

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class SearchBarField extends Component {
  render() {
    const {
      classes,
      intl,
      store: { search, ui },
      onSearchBarKeyDown,
    } = this.props;

    return (
      <div className={classes.searchBarField}>
        <div className={`icon iconfont icon-ic_search ${classes.searchBarLeftIcon}`} />
        <TextField
          className={classes.searchBarTextField}
          placeholder={intl.formatMessage({
            id: 'search.placeholder',
            defaultMessage: 'Search by Event Name, Event Address, Result Setter Address...',
          })}
          InputProps={{
            disableUnderline: true,
            classes: {
              input: classes.searchBarInput,
              root: classes.searchBarInputBase,
            },
            onKeyDown: (e) => onSearchBarKeyDown(e),
            onChange: e => {
              search.setSearchPhrase(e.target.value);
              search.debounceFetchEvents();
            },
            value: search.phrase,
            inputProps: {
              id: 'searchEventInput',
            },
          }}
        />
        <div
          className={`icon iconfont icon-ic_close ${classes.closeButton}`}
          onClick={ui.disableSearchBarMode}
        />
      </div>
    );
  }
}
