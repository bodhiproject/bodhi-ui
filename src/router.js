import React, { PropTypes } from 'react';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
// import { connect } from 'react-redux';

import App from './containers/App/App';
// import asyncComponent from './helpers/AsyncFunc';

const PublicRoutes = ({ history }) => (
  <ConnectedRouter history={history}>
    <div>
      <Route
        path="/"
        component={App}
      />
    </div>
  </ConnectedRouter>
);

PublicRoutes.propTypes = {
  history: PropTypes.object.isRequired,
};

export default PublicRoutes;
