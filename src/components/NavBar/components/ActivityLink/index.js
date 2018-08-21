import React from 'react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { Link } from '../Link';


const ActivityLink = observer(({ to, ...props }) => (
  <Route exact path={to}>
    <Link to={to} {...props} />
  </Route>));

export default inject('store')(ActivityLink);
