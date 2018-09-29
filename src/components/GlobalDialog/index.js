import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Error } from '@material-ui/icons';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';

import styles from './styles';

const messages = defineMessages({
  'str.error': {
    id: 'str.error',
    defaultMessage: 'Error',
  },
  'create.pendingExists': {
    id: 'create.pendingExists',
    defaultMessage: 'You can only create 1 event at a time. Please wait until your other Event is created.',
  },
});

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class GlobalDialog extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  render() {
    const { classes, intl } = this.props;
    const { globalDialog } = this.props.store.components;
    const { visible, title, heading, body } = globalDialog;

    const formattedTitle = title && title.id ? intl.formatMessage(messages[title.id]) : title;
    const formattedHeading = heading && heading.id ? intl.formatMessage(messages[heading.id]) : heading;
    const formattedBody = body && body.id ? intl.formatMessage(messages[body.id]) : body;

    return visible && (
      <Dialog open={visible} onClose={globalDialog.reset}>
        <DialogTitle>
          <div className={classes.titleContainer}>
            <Error className={classes.titleIcon} />
            {formattedTitle}
          </div>
        </DialogTitle>
        <DialogContent>
          <Typography className={classes.heading}>{formattedHeading}</Typography>
          <Typography className={classes.body}>{formattedBody}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={globalDialog.reset}>
            <FormattedMessage id="str.ok" defaultMessage="OK" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
