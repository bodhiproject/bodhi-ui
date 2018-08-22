import React, { PureComponent } from 'react';
import { inject, observer } from 'mobx-react';
import { Select, MenuItem } from '@material-ui/core';

export default class Settings extends PureComponent {
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
