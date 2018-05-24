import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from 'material-ui';
import { intlShape, injectIntl } from 'react-intl';

const ContentItem = injectIntl(({ intl, id, defaultMessage }) => (
  <li>
    <Typography variant="body2">
      {intl.formatMessage({ id, defaultMessage })}
    </Typography>
  </li>
));

ContentItem.propTypes = {
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
};

export default ContentItem;
