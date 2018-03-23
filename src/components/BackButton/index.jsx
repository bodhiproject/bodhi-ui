import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import ChevronLeft from 'material-ui-icons/ChevronLeft';
import Typography from 'material-ui/Typography';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './styles';
import { AppLocation } from '../../constants';

@withRouter
@injectIntl
@withStyles(styles, { withTheme: true })
@connect((state, props) => ({
  appLocation: state.App.get('appLocation'),
}), (dispatch, props) => ({
}))

export default class BackButton extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    appLocation: PropTypes.string.isRequired,
  };

  render() {
    const {
      classes,
    } = this.props;

    return (
      <Button className={classes.button} onClick={this.onBackClick}>
        <ChevronLeft />
        <FormattedMessage id="str.back" defaultMessage="Back" />
      </Button>
    );
  }

  onBackClick = () => {
    const { appLocation } = this.props;

    switch (appLocation) {
      case AppLocation.bet: {
        this.props.history.push('/');
        break;
      }
      case AppLocation.vote: {
        this.props.history.push('/bot-court');
        break;
      }
      case AppLocation.resultSet:
      case AppLocation.finalize:
      case AppLocation.withdraw: {
        this.props.history.push('/activities');
        break;
      }
      default: {
        break;
      }
    }
  };
}
