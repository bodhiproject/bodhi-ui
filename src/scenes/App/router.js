import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { AppLocation } from 'constants';

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
        path={`${url}${AppLocation.ALL_EVENTS}`}
        component={asyncComponent(() => import('../AllEvents'))}
      />
      <Route
        exact
        path={`${url}${AppLocation.QTUM_PREDICTION}`}
        component={asyncComponent(() => import('../QtumPrediction'))}
      />
      <Route
        exact
        path={`${url}${AppLocation.BOT_COURT}`}
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
        path={`${url}${AppLocation.WALLET}`}
        component={asyncComponent(() => import('../Wallet'))}
      />
      <Route
        exact
        path={`${url}${AppLocation.SET}`}
        component={asyncComponent(() => import('../Activities'))}
      />
      <Route
        exact
        path={`${url}${AppLocation.FINALIZE}`}
        component={asyncComponent(() => import('../Activities'))}
      />
      <Route
        exact
        path={`${url}${AppLocation.WITHDRAW}`}
        component={asyncComponent(() => import('../Activities'))}
      />
      <Route
        exact
        path={`${url}${AppLocation.ACTIVITY_HISTORY}`}
        component={asyncComponent(() => import('../Activities'))}
      />
    </Switch>
  );
};

AppRouter.propTypes = {
  url: PropTypes.string.isRequired,
};

export default AppRouter;
