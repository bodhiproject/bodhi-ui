import React, { PropTypes } from 'react';
import { Switch, Route } from 'react-router-dom';

import asyncComponent from '../../helpers/AsyncFunc';
import NavBar from '../../components/NavBar/index';
import { RouterPath } from '../../constants';

export default class AppRouter extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    langHandler: PropTypes.func.isRequired,
  };

  render() {
    let { url } = this.props;
    const { langHandler } = this.props;

    // Remove trailing '/' from url so that we can use `${url}/topic` below
    if (url[url.length - 1] === '/') {
      url = url.slice(0, url.length - 1);
    }

    return (
      <Switch>
        <Route
          exact
          path={`${url}${RouterPath.qtumPrediction}`}
          component={asyncComponent(() => import('../Dashboard/index'), langHandler)}
        />
        <Route
          exact
          path={`${url}${RouterPath.botCourt}`}
          component={asyncComponent(() => import('../Dashboard/vote'), langHandler)}
        />
        <Route
          exact
          path={`${url}/oracle/:topicAddress/:address/:txid`}
          component={asyncComponent(() => import('../Event/scenes/oracle'), langHandler)}
        />
        <Route
          exact
          path={`${url}/topic/:address`}
          component={asyncComponent(() => import('../Event/scenes/topic'), langHandler)}
        />
        <Route
          exact
          path={`${url}${RouterPath.myWallet}`}
          component={asyncComponent(() => import('../Wallet/index'), langHandler)}
        />
        <Route
          exact
          path={`${url}${RouterPath.set}`}
          component={asyncComponent(() => import('../Activities/index'), langHandler)}
        />
        <Route
          exact
          path={`${url}${RouterPath.finalize}`}
          component={asyncComponent(() => import('../Activities/index'), langHandler)}
        />
        <Route
          exact
          path={`${url}${RouterPath.withdraw}`}
          component={asyncComponent(() => import('../Activities/index'), langHandler)}
        />
        <Route
          exact
          path={`${url}${RouterPath.activityHistory}`}
          component={asyncComponent(() => import('../Activities/index'), langHandler)}
        />
      </Switch>
    );
  }
}
