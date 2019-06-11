import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';

import styles from '../styles';
import { ContentItem } from './contentItem';

const messages = defineMessages({
  tutorial2Content0Msg: {
    id: 'tutorial2.content0',
    defaultMessage: 'Assuming you have not used the Naka Wallet client before, now that you have a brand new Naka wallet, it is advised to take the proper steps to encrypt and back it up first.',
  },
  tutorial2Content1Msg: {
    id: 'tutorial2.content1',
    defaultMessage: 'The Naka Wallet is responsible for holding your passphrase and private keys. Bodhi Dapp does not store or handle this for you.',
  },
});

const Tutorial2 = ({ classes }) => (
  <div>
    <Typography variant="h4" classes={{ subtitle1: classes.tutorialDialogContentTitle }}>
      <FormattedMessage id="tutorial2.title" defaultMessage="Securing Your New Wallet" />
    </Typography>
    <ul className={classes.contentList}>
      <ContentItem id={messages.tutorial2Content0Msg.id} defaultMessage={messages.tutorial2Content0Msg.defaultMessage} />
      <li>
        <Typography variant="body2">
          <a className={classes.link} href="https://medium.com/publicaio/a-complete-guide-to-using-metamask-updated-version-cd0d6f8c338f" target="_blank">
          https://medium.com/publicaio/a-complete-guide-to-using-metamask-updated-version-cd0d6f8c338f
          </a>
        </Typography>
      </li>
      <ContentItem id={messages.tutorial2Content1Msg.id} defaultMessage={messages.tutorial2Content1Msg.defaultMessage} />
    </ul>
  </div>
);

Tutorial2.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default injectIntl(withStyles(styles, { withTheme: true })(Tutorial2));
