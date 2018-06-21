import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import asyncComponent from '../../helpers/AsyncFunc';
import { RouterPath } from '../../constants';


const AppRouter = ({ url }) => {
  // Remove trailing '/' from url so that we can use `${url}/topic` below
  if (url[url.length - 1] === '/') {
    url = url.slice(0, url.length - 1); // eslint-disable-line
  }

  return (
    <Switch>
      <Route
        exact
        path={`${url}${RouterPath.allEvents}`}
        component={asyncComponent(() => import('../AllEvents'))}
      />
      <Route
        exact
        path={`${url}${RouterPath.qtumPrediction}`}
        component={asyncComponent(() => import('../QtumPrediction'))}
      />
      <Route
        exact
        path={`${url}${RouterPath.botCourt}`}
        component={asyncComponent(() => import('../Dashboard/vote'))}
      />
      <Route
        exact
        path={`${url}/oracle/:topicAddress/:address/:txid`}
        component={asyncComponent(() => import('../Event/scenes/oracle'))}
      />
      <Route
        exact
        path={`${url}/topic/:address`}
        component={asyncComponent(() => import('../Event/scenes/topic'))}
      />
      <Route
        exact
        path={`${url}${RouterPath.myWallet}`}
        component={asyncComponent(() => import('../Wallet'))}
      />
      <Route
        exact
        path={`${url}${RouterPath.set}`}
        component={asyncComponent(() => import('../Activities'))}
      />
      <Route
        exact
        path={`${url}${RouterPath.finalize}`}
        component={asyncComponent(() => import('../Activities'))}
      />
      <Route
        exact
        path={`${url}${RouterPath.withdraw}`}
        component={asyncComponent(() => import('../Activities'))}
      />
      <Route
        exact
        path={`${url}${RouterPath.activityHistory}`}
        component={asyncComponent(() => import('../Activities'))}
      />
    </Switch>
  );
};

AppRouter.propTypes = {
  url: PropTypes.string.isRequired,
};

export default AppRouter;
