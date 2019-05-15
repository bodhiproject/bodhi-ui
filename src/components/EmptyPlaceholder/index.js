import React from 'react';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Typography, withWidth, Button, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Routes } from 'constants';
import styles from './styles';

export const Row = withStyles(styles)(({ classes, ...props }) => (
  <div className={classes.row} {...props} />
));

const EmptyPlaceholder = ({ store: { ui, createEvent }, intl, ...props }) => {
  const { message, width } = props;
  return (
    <Row>
      <Row><img src="/images/empty.svg" alt="empty placeholder" /></Row>
      <Row>
        <Typography variant="h6">
          {intl.formatMessage({ id: message.id, defaultMessage: message.defaultMessage })}
        </Typography>
      </Row>
      {ui.location === Routes.PREDICTION && !ui.searchBarMode &&
      <Row>
        <Button
          size={width === 'xs' ? 'small' : 'medium'}
          color="primary"
          onClick={createEvent.open} // TODO: REVERT when create is done
        >
          <FormattedMessage id="create.dialogTitle" defaultMessage="CREATE EVENT" />
        </Button>
      </Row>
      }
    </Row>
  );
};

EmptyPlaceholder.propTypes = {
  width: PropTypes.string.isRequired,
};

export default withWidth()(injectIntl(inject('store')(EmptyPlaceholder)));
