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
            return import('../dashboard');
          })}
        />
        <Route
          exact
          path={`${url}/blankPage`}
          component={asyncComponent(() => import('../blankPage'))}
        />
        <Route
          exact
          path={`${url}/oracle/:address`}
          component={asyncComponent(() => import('../oracle'))}
        />
        <Route
          exact
          path={`${url}/topic/:address`}
          component={asyncComponent(() => import('../topic'))}
        />
        <Route
          exact
          path={`${url}/create-topic`}
          component={asyncComponent(() => import('../createTopic'))}
        />
      </Switch>
    );
  }
}

AppRouter.propTypes = {
  url: PropTypes.string.isRequired,
};

export default AppRouter;
