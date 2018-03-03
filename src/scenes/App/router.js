import React, { PropTypes } from 'react';
import { Switch, Route } from 'react-router-dom';
import asyncComponent from '../../helpers/AsyncFunc';

class AppRouter extends React.Component {
  render() {
    let { url } = this.props;

    // Remove trailing '/' from url so that we can use `${url}/topic` below
    if (url[url.length - 1] === '/') {
      url = url.slice(0, url.length - 1);
    }

    return (
      <Switch>
        <Route
          exact
          path={`${url}/`}
          component={asyncComponent(() => {
            console.log('{url}/');
            return import('../Dashboard/index');
          })}
        />
        <Route
          exact
          path={`${url}/oracle/:topicAddress/:address`}
          component={asyncComponent(() => import('../Oracle/index'))}
        />
        <Route
          exact
          path={`${url}/topic/:address`}
          component={asyncComponent(() => import('../Topic/index'))}
        />
        <Route
          exact
          path={`${url}/create-topic`}
          component={asyncComponent(() => import('../CreateTopic/index'))}
        />
        <Route
          exact
          path={`${url}/my-wallet`}
          component={asyncComponent(() => import('../Wallet/index'))}
        />
      </Switch>
    );
  }
}

AppRouter.propTypes = {
  url: PropTypes.string.isRequired,
};

export default AppRouter;
