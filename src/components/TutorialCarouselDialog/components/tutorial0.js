import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from 'material-ui';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from '../styles';
import { ContentItem } from './contentItem';

const Tutorial0 = ({ classes }) => (
  <div>
    <Typography variant="display1">
      <FormattedMessage id="tutorial0.title" defaultMessage="What Is The Bodhi App" />
    </Typography>
    <ul className={classes.contentList}>
      <ContentItem id="tutorial0.content0" defaultMessage="Bodhi Dapp is a free, open-source, client-side interface." />
      <ContentItem id="tutorial0.content1" defaultMessage="It allows you to interact directly with the blockchain while remaining in full control of your keys & your funds." />
      <li>
        <Typography variant="body2">
          <FormattedMessage id="tutorial0.content2Part0" defaultMessage="Bodhi Dapp is " />
          <span className={classes.warning}><FormattedMessage id="tutorial0.content2Part1" defaultMessage="not " /></span>
          <FormattedMessage id="tutorial0.content2Part2" defaultMessage="a standalone wallet. We use the Qtum Core Wallet to handle all transactions and interactions with the Qtum blockchain." />
        </Typography>
      </li>
      <li>
        <Typography variant="body2">
          <span className={classes.warning}><FormattedMessage id="tutorial0.content3Part0" defaultMessage="You and only you " /></span>
          <FormattedMessage id="tutorial0.content3Part1" defaultMessage="are responsible for your security. This saying is applicable for all things related to blockchain and cryptocurrency." />
        </Typography>
      </li>
    </ul>
  </div>
);

Tutorial0.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default injectIntl(withStyles(styles, { withTheme: true })(Tutorial0));
