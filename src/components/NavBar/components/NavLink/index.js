import React from 'react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { includes } from 'lodash';

import { Link } from '../Link';


const NavLink = ({ to, routes, store: { ui: { location } }, ...props }) => (
  <Route exact path={to}>
    {() => <Link to={to} active={(routes && includes(routes, location)) || to === location} {...props} />}
  </Route>
);

export default inject('store')(observer(NavLink));
