import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Paper, Typography, Select, MenuItem, Grid, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { Routes } from 'constants';

import styles from './styles';

const messages = defineMessages({
  languageSetting: {
    id: 'settings.languageSetting',
    defaultMessage: 'Language:',
  },
});

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class Settings extends Component {
  componentDidMount() {
    this.props.store.ui.location = Routes.SETTINGS;
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root} elevation={0}>
        <Typography variant="h4" className={classes.headerText}>
          <FormattedMessage id="settings.settings" defaultMessage="Settings" />
        </Typography>
        <Grid container className={classes.settingGridContainer}>
          <Grid item xs={12} sm={4}>
            <SettingName message={messages.languageSetting} />
          </Grid>
          <Grid item xs={12} sm={8}>
            <LanguageSelector {...this.props} />
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

const SettingName = withStyles(styles)(injectIntl(({ classes, intl, message }) => (
  <Typography variant="h6" className={classes.settingName}>
    {intl.formatMessage(message)}
  </Typography>
)));

const LanguageSelector = inject('store')(observer(({ store: { ui } }) => (
  <Select value={ui.locale} name="lang" onChange={(e) => ui.changeLocale(e.target.value)}>
    <MenuItem value="en-US">English</MenuItem>
    <MenuItem value="zh-Hans-CN">中文</MenuItem>
    <MenuItem value="ko-KR">한국어</MenuItem>
  </Select>
)));
