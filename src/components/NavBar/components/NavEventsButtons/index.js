import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import _ from 'lodash';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';

import { EventStatus } from '../../../../constants';
import styles from './styles';

class NavEventsButtons extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <Link to="/">
          <Button
            data-index={EventStatus.Bet}
            className={classNames(
              classes.navEventsButton,
              'selected'
            )}
          >
            <FormattedMessage id="navbar.qtumPredict" defaultMessage="QTUM Prediction" />
          </Button>
        </Link>
        <Link to="/bot-court">
          <Button
            data-index={EventStatus.Vote}
            className={classNames(
              classes.navEventsButton,
              'selected'
            )}
          >
            <FormattedMessage id="navbar.botCourt" defaultMessage="BOT Court" />
          </Button>
        </Link>
      </div>
    );
  }
}

NavEventsButtons.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default injectIntl(withStyles(styles, { withTheme: true })(NavEventsButtons));
