import React from 'react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { Link } from '../Link';


const NavLink = observer(({ to, store: { ui: { location } }, ...props }) => (
  <Route exact path={to}>
    {({ match }) => <Link to={to} active={!!match || to === location} {...props} />}
  </Route>
));

export default inject('store')(NavLink);
