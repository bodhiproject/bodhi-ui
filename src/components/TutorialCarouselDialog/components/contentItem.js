import React from 'react';
import { Typography } from '@material-ui/core';
import { injectIntl } from 'react-intl';

export const ContentItem = injectIntl(({ intl, id, defaultMessage }) => ( // eslint-disable-line
  <li>
    <Typography variant="body2">
      {intl.formatMessage({ id, defaultMessage })}
    </Typography>
  </li>
));
