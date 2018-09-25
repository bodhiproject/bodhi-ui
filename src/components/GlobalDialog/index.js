import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Error } from '@material-ui/icons';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './styles';

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

    return visible && (
      <Dialog open={visible} onClose={globalDialog.reset}>
        <DialogTitle>
          <div className={classes.titleContainer}>
            <Error className={classes.titleIcon} />
            {title.id ? intl.formatMessage({ id: title.id, defaultMessage: title.defaultMessage }) : title}
          </div>
        </DialogTitle>
        <DialogContent>
          <Typography className={classes.heading}>
            {heading && heading.id
              ? intl.formatMessage({ id: heading.id, defaultMessage: heading.defaultMessage })
              : heading
            }
          </Typography>
          <Typography className={classes.body}>
            {body && body.id ? intl.formatMessage({ id: body.id, defaultMessage: body.defaultMessage }) : body}
          </Typography>
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
