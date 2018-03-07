import React, { Component, PropTypes } from 'react';
import Button from 'material-ui/Button';
import _ from 'lodash';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';

import dashboardActions from '../../../../redux/Dashboard/actions';
import { EventStatus } from '../../../../constants';
import styles from './styles';

class NavEventsButtons extends Component {
  constructor(props) {
    super(props);

    this.onBtnClicked = this.onBtnClicked.bind(this);
  }

  onBtnClicked(event) {
    const index = event.currentTarget.getAttribute('data-index');

    if (index) {
      this.props.tabIndexChanged(parseInt(index, 10));
    }

    if (window.location.pathname !== '/') {
      window.location.assign('/');
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button
          data-index={EventStatus.Bet}
          onClick={this.onBtnClicked}
          className={classNames(
            classes.navEventsButton,
            _.toNumber(this.props.tabIndex) === EventStatus.Bet && window.location.pathname === '/' ? 'selected' : ''
          )}
        >
          QTUM Prediction
        </Button>
        <Button
          data-index={EventStatus.Vote}
          onClick={this.onBtnClicked}
          className={classNames(
            classes.navEventsButton,
            _.toNumber(this.props.tabIndex) === EventStatus.Vote && window.location.pathname === '/' ? 'selected' : ''
          )}
        >
          BOT Court
        </Button>
      </div>
    );
  }
}

NavEventsButtons.propTypes = {
  classes: PropTypes.object.isRequired,
  tabIndex: PropTypes.number,
  tabIndexChanged: PropTypes.func,
};

NavEventsButtons.defaultProps = {
  tabIndex: 0,
  tabIndexChanged: undefined,
};

const mapStateToProps = (state) => ({
  tabIndex: state.Dashboard.get('tabIndex'),
});

function mapDispatchToProps(dispatch) {
  return {
    tabIndexChanged: (index) => dispatch(dashboardActions.tabIndexChanged(index)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles, { withTheme: true })(NavEventsButtons)));
