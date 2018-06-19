import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from '../styles';
import { ContentItem } from './contentItem';


const Tutorial5 = ({ classes }) => (
  <div>
    <Typography variant="display1">
      <FormattedMessage id="tutorial5.title" defaultMessage="What Is Blockchain" />
    </Typography>
    <ul className={classes.contentList}>
      <ContentItem id="tutorial5.content0" defaultMessage="The blockchain is like a huge, global, decentralized spreadsheet." />
      <ContentItem id="tutorial5.content1" defaultMessage="It keeps track of who sent how many tokens to whom, and what the balance of every account is." />
      <ContentItem id="tutorial5.content2" defaultMessage="It is stored and maintained by thousands of people (miners) across the globe who have special computers." />
      <ContentItem id="tutorial5.content3" defaultMessage="The blocks in the blockchain are made up of all the individual transactions sent from users who interact with the blockchain." />
      <ContentItem id="tutorial5.content4" defaultMessage="When you see your balance on Bodhi Dapp, the Qtum Wallet, or view your transactions on the Qtum Explorer, you are seeing data on the blockchain, not in our personal systems." />
    </ul>
  </div>
);

Tutorial5.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default injectIntl(withStyles(styles, { withTheme: true })(Tutorial5));
