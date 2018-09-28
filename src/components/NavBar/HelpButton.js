import React from 'react';
import { withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';

import styles from './styles';
import { faqUrls } from '../../config/app';
import Tracking from '../../helpers/mixpanelUtil';


const HelpButton = ({ classes, intl, changeDropDownDirection }) => (
  <a
    onClick={() => {
      window.open(faqUrls[intl.locale], '_blank');
      Tracking.track('navBar-helpClick');
    }}
  >
    <div className={classes.navDropdownLinkItem} onClick={changeDropDownDirection}>
      <FormattedMessage id="help" defaultMessage="Help" />
    </div>
  </a>
);

export default withStyles(styles, { withTheme: true })(inject('store')(observer(HelpButton)));
