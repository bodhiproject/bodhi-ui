import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Link } from '../Link/index';
import { AppLocation, RouterPath } from '../../../../constants';


@connect((state) => ({
  appLocation: state.App.get('appLocation'),
}))
export class NavLink extends Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    appLocation: PropTypes.string,
  }

  static defaultProps = {
    appLocation: undefined,
  }

  render() {
    const { appLocation, to, ...props } = this.props;
    const map = {
      [AppLocation.bet]: RouterPath.qtumPrediction,
      [AppLocation.vote]: RouterPath.botCourt,
      // so all the routes under /activities keep the pointer under it
      [AppLocation.resultSet]: RouterPath.set,
      [AppLocation.finalize]: RouterPath.set,
      [AppLocation.withdraw]: RouterPath.set,
      [AppLocation.activityHistory]: RouterPath.set,
    };
    return (
      <Route exact path={to}>
        {({ match }) => <Link to={to} active={!!match || to === map[appLocation]} {...props} />}
      </Route>
    );
  }
}
