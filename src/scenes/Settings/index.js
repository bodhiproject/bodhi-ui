import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Paper, List, ListItem, Typography, Select, MenuItem, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { Routes } from 'constants';

import styles from './styles';

const messages = defineMessages({
  languageSetting: {
    id: 'settings.languageSetting',
    defaultMessage: 'Language:',
  },
  languageSettingDesc: {
    id: 'settings.languageSettingDesc',
    defaultMessage: 'You will only see events with this language.',
  },
  eventVersionSetting: {
    id: 'settings.eventVersionSetting',
    defaultMessage: 'Event Version:',
  },
  eventVersionSettingDesc: {
    id: 'settings.eventVersionSettingDesc',
    defaultMessage: 'You will only see events with this version.',
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

  renderSettingInfo = (message, subMessage) => {
    const { classes, intl } = this.props;
    return (
      <div className={classes.settingDescription}>
        <Typography variant="subtitle1" className={classes.settingName}>
          {intl.formatMessage(message)}
        </Typography>
        <Typography variant="subtitle2">
          {intl.formatMessage(subMessage)}
        </Typography>
      </div>
    );
  }

  renderLangSelector = () => {
    const { classes, store: { ui } } = this.props;
    return (
      <ListItem className={classes.settingContainer}>
        {this.renderSettingInfo(
          messages.languageSetting,
          messages.languageSettingDesc
        )}
        <Select
          variant="outlined"
          name="lang"
          value={ui.locale}
          onChange={(e) => ui.changeLocale(e.target.value)}
        >
          <MenuItem value="en-US"><img src='/images/us.svg' alt='cup' className={classes.flag} />English</MenuItem>
          <MenuItem value="zh-Hans-CN"><img src='/images/china.svg' alt='cup' className={classes.flag} />中文</MenuItem>
          <MenuItem value="ko-KR"><img src='/images/korea.svg' alt='cup' className={classes.flag} />한국어</MenuItem>
        </Select>
      </ListItem>
    );
  }

  renderVersionSelector = () => {
    const { classes, store: { global } } = this.props;
    const isTestnet = process.env.NETWORK === 'testnet';
    return (
      <ListItem className={classes.settingContainer}>
        {this.renderSettingInfo(
          messages.eventVersionSetting,
          messages.eventVersionSettingDesc
        )}
        <Select
          variant="outlined"
          name="eventVersion"
          value={global.eventVersion}
          onChange={(e) => global.setEventVersion(e.target.value)}
        >
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          {isTestnet && <MenuItem value={4}>4</MenuItem>}
          {isTestnet && <MenuItem value={3}>3</MenuItem>}
          {isTestnet && <MenuItem value={2}>2</MenuItem>}
          {isTestnet && <MenuItem value={1}>1</MenuItem>}
          {isTestnet && <MenuItem value={0}>0</MenuItem>}
        </Select>
      </ListItem>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root} elevation={0}>
        <Typography variant="h6" className={classes.headerText}>
          <FormattedMessage id="settings.settings" defaultMessage="Settings" />
        </Typography>
        <Paper elevation={2}>
          <List component="nav">
            {this.renderLangSelector()}
            {this.renderVersionSelector()}
          </List>
        </Paper>
      </Paper>
    );
  }
}
