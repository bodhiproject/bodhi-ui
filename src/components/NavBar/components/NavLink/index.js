import React from 'react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { Link } from '../Link';


<<<<<<< HEAD
const NavLink = observer(({ to, store: { ui: { location } }, ...props }) => (
  <Route exact path={to}>
    {({ match }) => <Link to={to} active={!!match || to === location} {...props} />}
  </Route>
));
=======
const NavLink = observer(({ to, store: { ui }, ...props }) => {
  const location = {
    [AppLocation.bet]: AppLocation.QTUM_PREDICTION,
    [AppLocation.BOT_COURT]: AppLocation.BOT_COURT,
    [AppLocation.ALL_EVENTS]: AppLocation.ALL_EVENTS,
    // so all the routes under /activities keep the pointer under it
    [AppLocation.SET]: AppLocation.SET,
    [AppLocation.FINALIZE]: AppLocation.SET,
    [AppLocation.WITHDRAW]: AppLocation.SET,
    [AppLocation.ACTIVITY_HISTORY]: AppLocation.SET,
  }[ui.location];
  return (
    <Route exact path={to}>
      {({ match }) => <Link to={to} active={!!match || to === location} {...props} />}
    </Route>
  );
});
>>>>>>> change all, all testing passed

export default inject('store')(NavLink);
