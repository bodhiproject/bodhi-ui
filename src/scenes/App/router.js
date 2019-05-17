import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { Routes } from 'constants';

import asyncComponent from '../../helpers/AsyncFunc';


const AppRouter = ({ url }) => {
  // Remove trailing '/' from url so that we can use `${url}/topic` below
  if (url[url.length - 1] === '/') {
    url = url.slice(0, url.length - 1); // eslint-disable-line
  }

  return (
    <Switch>
      <Route
        exact
        path={`${url}${Routes.ALL_EVENTS}`}
        component={asyncComponent(() => import('../AllEvents'))}
      />
      <Route
        exact
        path={`${url}${Routes.PREDICTION}`}
        component={asyncComponent(() => import('../Prediction'))}
      />
      <Route
        exact
        path={`${url}${Routes.ARBITRATION}`}
        component={asyncComponent(() => import('../Arbitration'))}
      />
      <Route
        exact
        path={`${url}/oracle/:topicAddress/:address/:txid`}
        component={asyncComponent(() => import('../Event'))}
      />
      <Route
        exact
        path={`${url}/event/:txid`}
        component={asyncComponent(() => import('../Event'))}
      />
      <Route
        exact
        path={`${url}/topic/:address`}
        component={asyncComponent(() => import('../Event'))}
      />
      <Route
        exact
        path={`${url}${Routes.WALLET}`}
        component={asyncComponent(() => import('../Wallet'))}
      />
      <Route
        exact
        path={`${url}${Routes.SETTINGS}`}
        component={asyncComponent(() => import('../Settings'))}
      />
      <Route
        exact
        path={`${url}${Routes.SET}`}
        component={asyncComponent(() => import('../Activities'))}
      />
      <Route
        exact
        path={`${url}${Routes.WITHDRAW}`}
        component={asyncComponent(() => import('../Activities'))}
      />
      <Route
        exact
        path={`${url}${Routes.ACTIVITY_HISTORY}`}
        component={asyncComponent(() => import('../Activities'))}
      />
      <Route
        exact
        path={`${url}${Routes.LEADERBOARD}`}
        component={asyncComponent(() => import('../Leaderboard'))}
      />
    </Switch>
  );
};

AppRouter.propTypes = {
  url: PropTypes.string.isRequired,
};

export default AppRouter;
