import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import asyncComponent from '../../helpers/AsyncFunc';
import { RouterPath } from '../../constants';


const AppRouter = ({ url, langHandler, lang }) => {
  // Remove trailing '/' from url so that we can use `${url}/topic` below
  if (url[url.length - 1] === '/') {
    url = url.slice(0, url.length - 1); // eslint-disable-line
  }

  return (
    <Switch>
      <Route
        exact
        path={`${url}${RouterPath.allEvents}`}
        component={asyncComponent(() => import('../AllEvents'), langHandler)}
      />
      <Route
        exact
        path={`${url}${RouterPath.qtumPrediction}`}
        component={asyncComponent(() => import('../Dashboard/index'), langHandler, lang)}
      />
      <Route
        exact
        path={`${url}${RouterPath.botCourt}`}
        component={asyncComponent(() => import('../Dashboard/vote'), langHandler, lang)}
      />
      <Route
        exact
        path={`${url}/oracle/:topicAddress/:address/:txid`}
        component={asyncComponent(() => import('../Event/scenes/oracle'), langHandler, lang)}
      />
      <Route
        exact
        path={`${url}/topic/:address`}
        component={asyncComponent(() => import('../Event/scenes/topic'), langHandler, lang)}
      />
      <Route
        exact
        path={`${url}${RouterPath.myWallet}`}
        component={asyncComponent(() => import('../Wallet/index'), langHandler, lang)}
      />
      <Route
        exact
        path={`${url}${RouterPath.set}`}
        component={asyncComponent(() => import('../Activities/index'), langHandler, lang)}
      />
      <Route
        exact
        path={`${url}${RouterPath.finalize}`}
        component={asyncComponent(() => import('../Activities/index'), langHandler, lang)}
      />
      <Route
        exact
        path={`${url}${RouterPath.withdraw}`}
        component={asyncComponent(() => import('../Activities/index'), langHandler, lang)}
      />
      <Route
        exact
        path={`${url}${RouterPath.activityHistory}`}
        component={asyncComponent(() => import('../Activities/index'), langHandler, lang)}
      />
    </Switch>
  );
};

AppRouter.propTypes = {
  url: PropTypes.string.isRequired,
  langHandler: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
};

export default AppRouter;
