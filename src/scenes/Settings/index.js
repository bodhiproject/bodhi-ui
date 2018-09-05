import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Select, MenuItem } from '@material-ui/core';
import { Routes } from 'constants';

@inject('store')
@observer
export default class Settings extends Component {
  componentDidMount() {
    this.props.store.ui.location = Routes.HISTORY;
  }

  render() {
    return (<div>
      <h1>Settings</h1>
      <LanguageSelector {...this.props} />
    </div>);
  }
}

const LanguageSelector = inject('store')(observer(({ store: { ui } }) => (
  <Select
    value={ui.locale}
    onChange={(e) => ui.changeLocale(e.target.value)}
    name="lang"
    disableUnderline
  >
    <MenuItem value="en-US">English</MenuItem>
    <MenuItem value="zh-Hans-CN">中文</MenuItem>
    <MenuItem value="ko-KR">한국어</MenuItem>
  </Select>
)));
