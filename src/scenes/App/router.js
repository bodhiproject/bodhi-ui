import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
<<<<<<< HEAD
import { Routes } from 'constants';
=======
import { AppLocation } from 'constants';
>>>>>>> remove RouterPath

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
<<<<<<< HEAD
        path={`${url}${Routes.ALL_EVENTS}`}
=======
        path={`${url}${AppLocation.allEvents}`}
>>>>>>> remove RouterPath
        component={asyncComponent(() => import('../AllEvents'))}
      />
      <Route
        exact
<<<<<<< HEAD
        path={`${url}${Routes.QTUM_PREDICTION}`}
=======
        path={`${url}${AppLocation.qtumPrediction}`}
>>>>>>> remove RouterPath
        component={asyncComponent(() => import('../QtumPrediction'))}
      />
      <Route
        exact
<<<<<<< HEAD
        path={`${url}${Routes.BOT_COURT}`}
=======
        path={`${url}${AppLocation.botCourt}`}
>>>>>>> remove RouterPath
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
<<<<<<< HEAD
        path={`${url}${Routes.WALLET}`}
=======
        path={`${url}${AppLocation.myWallet}`}
>>>>>>> remove RouterPath
        component={asyncComponent(() => import('../Wallet'))}
      />
      <Route
        exact
<<<<<<< HEAD
        path={`${url}${Routes.SET}`}
=======
        path={`${url}${AppLocation.set}`}
>>>>>>> remove RouterPath
        component={asyncComponent(() => import('../Activities'))}
      />
      <Route
        exact
<<<<<<< HEAD
        path={`${url}${Routes.FINALIZE}`}
=======
        path={`${url}${AppLocation.finalize}`}
>>>>>>> remove RouterPath
        component={asyncComponent(() => import('../Activities'))}
      />
      <Route
        exact
<<<<<<< HEAD
        path={`${url}${Routes.WITHDRAW}`}
=======
        path={`${url}${AppLocation.withdraw}`}
>>>>>>> remove RouterPath
        component={asyncComponent(() => import('../Activities'))}
      />
      <Route
        exact
<<<<<<< HEAD
        path={`${url}${Routes.ACTIVITY_HISTORY}`}
=======
        path={`${url}${AppLocation.activityHistory}`}
>>>>>>> remove RouterPath
        component={asyncComponent(() => import('../Activities'))}
      />
    </Switch>
  );
};

AppRouter.propTypes = {
  url: PropTypes.string.isRequired,
};

export default AppRouter;
