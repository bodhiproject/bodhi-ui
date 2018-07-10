import React from 'react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { AppLocation } from 'constants';
import { Link } from '../Link';


const NavLink = observer(({ to, store: { ui }, ...props }) => {
  const location = {
    [AppLocation.bet]: AppLocation.qtumPrediction,
    [AppLocation.botCourt]: AppLocation.botCourt,
    [AppLocation.allEvents]: AppLocation.allEvents,
    // so all the routes under /activities keep the pointer under it
    [AppLocation.resultSet]: AppLocation.set,
    [AppLocation.finalize]: AppLocation.set,
    [AppLocation.withdraw]: AppLocation.set,
    [AppLocation.activityHistory]: AppLocation.set,
  }[ui.location];
  return (
    <Route exact path={to}>
      {({ match }) => <Link to={to} active={!!match || to === location} {...props} />}
    </Route>
  );
});

export default inject('store')(NavLink);
