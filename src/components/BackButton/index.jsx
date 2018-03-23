import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './styles';

class BackButton extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const {
      classes,
    } = this.props;

    return (
      <Button className={classes.button}>
        <FormattedMessage id="str.back" defaultMessage="Back" />
      </Button>
    );
  }

  handleClose = () => {
    this.props.onClosed('');
  };
}

export default injectIntl(withStyles(styles, { withTheme: true })(SelectAddressDialog));
