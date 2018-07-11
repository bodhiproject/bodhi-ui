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
        path={`${url}${Routes.QTUM_PREDICTION}`}
        component={asyncComponent(() => import('../QtumPrediction'))}
      />
      <Route
        exact
        path={`${url}${Routes.BOT_COURT}`}
        component={asyncComponent(() => import('../BotCourt'))}
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
        path={`${url}${Routes.WALLET}`}
        component={asyncComponent(() => import('../Wallet'))}
      />
      <Route
        exact
        path={`${url}${Routes.SET}`}
        component={asyncComponent(() => import('../Activities'))}
      />
      <Route
        exact
        path={`${url}${Routes.FINALIZE}`}
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
    </Switch>
  );
};

AppRouter.propTypes = {
  url: PropTypes.string.isRequired,
};

export default AppRouter;
