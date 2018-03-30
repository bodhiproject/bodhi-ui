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
      [AppLocation.resultSet]: RouterPath.set,
      [AppLocation.finalize]: RouterPath.finalize,
      [AppLocation.withdraw]: RouterPath.withdraw,
    };
    return (
      <Route exact path={to}>
        {({ match }) => <Link to={to} active={!!match || to === map[appLocation]} {...props} />}
      </Route>
    );
  }
}
