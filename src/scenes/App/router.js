import React, { PropTypes } from 'react';
import { Switch, Route } from 'react-router-dom';
import asyncComponent from '../../helpers/AsyncFunc';
import NavBar from '../../components/NavBar/index';

class AppRouter extends React.Component {
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
          path={`${url}/`}
          component={asyncComponent(() => import('../Dashboard/index'), langHandler)}
        />
        <Route
          exact
          path={`${url}/bot-court`}
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
          path={`${url}/my-wallet`}
          component={asyncComponent(() => import('../Wallet/index'), langHandler)}
        />
        <Route
          exact
          path={`${url}/activities`}
          component={asyncComponent(() => import('../Activities/index'), langHandler)}
        />
      </Switch>
    );
  }
}

AppRouter.propTypes = {
  url: PropTypes.string.isRequired,
  langHandler: PropTypes.func.isRequired,
};

export default AppRouter;
