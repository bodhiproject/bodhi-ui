import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles, IconButton, Tooltip, Typography, ClickAwayListener } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import cx from 'classnames';

import styles from './styles';

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class ImportantNote extends Component {
  state = {
    open: false,
  };

  componentDidMount() {
  }

  handleTooltipOpen = () => this.setState({ open: true });
  handleTooltipClose = () => this.setState({ open: false });

  render() {
    const { classes, heading, message } = this.props;
    const { open } = this.state;

    return heading && message && (
      <div>
        <ClickAwayListener onClickAway={this.handleTooltipClose}>
          <div className={classes.iconHeadingContainer}>
            <Tooltip
              title={<span>{message}</span>}
              open={open}
            >
              <IconButton className={classes.iconButton} disableRipple onClick={this.handleTooltipOpen} >
                <i className={cx('icon iconfont icon-ic_info', classes.icon)} />
              </IconButton>
            </Tooltip>
            <Typography className={classes.heading}>{heading}</Typography>
          </div>
        </ClickAwayListener>
      </div>
    );
  }
}
