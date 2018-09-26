import React from 'react';
import { Typography, withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';

import styles from '../styles';

export const ContentItem = injectIntl(withStyles(styles, { withTheme: true })(({ classes, intl, id, defaultMessage }) => ( // eslint-disable-line
  <li>
    <Typography variant="body2" classes={{ body2: classes.tutorialDialogContentItem }}>
      {intl.formatMessage({ id, defaultMessage })}
    </Typography>
  </li>
)));
