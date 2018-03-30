import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Link } from '../Link/index';


export const NavLink = ({ to, ...props }) => (
  <Route exact path={to}>
    {({ match }) => <Link to={to} active={match} {...props} />}
  </Route>
);

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
};
