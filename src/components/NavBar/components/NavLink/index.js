import React from 'react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { Link } from '../Link';
import { AppLocation, RouterPath } from '../../../../constants';


const NavLink = observer(({ to, store: { ui }, ...props }) => {
  const location = {
    [AppLocation.bet]: RouterPath.qtumPrediction,
    [AppLocation.vote]: RouterPath.botCourt,
    [AppLocation.allEvents]: RouterPath.allEvents,
    // so all the routes under /activities keep the pointer under it
    [AppLocation.resultSet]: RouterPath.set,
    [AppLocation.finalize]: RouterPath.set,
    [AppLocation.withdraw]: RouterPath.set,
    [AppLocation.activityHistory]: RouterPath.set,
  }[ui.location];
  return (
    <Route exact path={to}>
      {({ match }) => <Link to={to} active={!!match || to === location} {...props} />}
    </Route>
  );
});

export default inject('store')(NavLink);
