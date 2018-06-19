import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from '../styles';
import { ContentItem } from './contentItem';


const Tutorial6 = ({ classes }) => (
  <div>
    <Typography variant="display1">
      <FormattedMessage id="tutorial6.title" defaultMessage="Decentralization" />
    </Typography>
    <ul className={classes.contentList}>
      <ContentItem id="tutorial6.content0" defaultMessage="Having to be in control of your own security is the trade-off for decentralization." />
      <ContentItem id="tutorial6.content1" defaultMessage="You don't have to rely on your bank, government, or anyone else when you want to move your funds." />
      <ContentItem id="tutorial6.content2" defaultMessage="You don't have to rely on the security of an exchange or bank to keep your funds safe." />
      <ContentItem id="tutorial6.content3" defaultMessage="If you don't find these things valuable, ask yourself why you think the blockchain and cryptocurrencies are valuable." />
    </ul>
  </div>
);

Tutorial6.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default injectIntl(withStyles(styles, { withTheme: true })(Tutorial6));
