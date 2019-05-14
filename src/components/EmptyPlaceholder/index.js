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
          onClick={createEvent.create} // TODO: REVERT when create is done
        >
          <FormattedMessage id="create.dialogTitle" defaultMessage="CREATE EVENT" />
        </Button>
        <Button
          size={width === 'xs' ? 'small' : 'medium'}
          color="primary"
          onClick={createEvent.bet} // TODO: REVERT when bet is done
        >
          <FormattedMessage id="create.dialogTitle1" defaultMessage="BET" />
        </Button>
        <Button
          size={width === 'xs' ? 'small' : 'medium'}
          color="primary"
          onClick={createEvent.setResult} // TODO: REVERT when set is done
        >
          <FormattedMessage id="create.dialogTitle2" defaultMessage="SET RESULT" />
        </Button>
        <Button
          size={width === 'xs' ? 'small' : 'medium'}
          color="primary"
          onClick={createEvent.vote} // TODO: REVERT when vote is done
        >
          <FormattedMessage id="create.dialogTitle3" defaultMessage="VOTE" />
        </Button>
        <Button
          size={width === 'xs' ? 'small' : 'medium'}
          color="primary"
          onClick={createEvent.withdraw} // TODO: REVERT when withdraw is done
        >
          <FormattedMessage id="create.dialogTitle4" defaultMessage="WITHDRAW" />
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
