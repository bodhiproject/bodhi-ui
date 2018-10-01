import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Paper, Typography, Select, MenuItem, Grid, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Routes } from 'constants';

import styles from './styles';

@withStyles(styles, { withTheme: true })
@inject('store')
@injectIntl
@observer
export default class Settings extends Component {
  componentDidMount() {
    this.props.store.ui.location = Routes.SETTINGS;
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root} elevation={0}>
        <Typography variant="display1" className={classes.headerText}>
          <FormattedMessage id="settings.settings" defaultMessage="Settings" />
        </Typography>
        <Grid container>
          <Grid item xs={12} sm={2}>
            <Typography variant="title">
              <FormattedMessage id="settings.languageSetting" defaultMessage="Language:" />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={10}>
            <LanguageSelector {...this.props} />
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

const LanguageSelector = inject('store')(observer(({ store: { ui } }) => (
  <Select value={ui.locale} name="lang" onChange={(e) => ui.changeLocale(e.target.value)}>
    <MenuItem value="en-US">English</MenuItem>
    <MenuItem value="zh-Hans-CN">中文</MenuItem>
    <MenuItem value="ko-KR">한국어</MenuItem>
  </Select>
)));
