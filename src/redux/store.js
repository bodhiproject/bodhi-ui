import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import createGraphQLSubscriptionsMiddleware from 'redux-graphql-subscriptions'

import reducers from './reducers';
import rootSaga from './sagas';
import { endpoint } from '../config/app';

const history = createHistory();
const sagaMiddleware = createSagaMiddleware();
const routeMiddleware = routerMiddleware(history);
const graphSubsMiddleware = createGraphQLSubscriptionsMiddleware(endpoint.graphWs);
const middlewares = [thunk, sagaMiddleware, routeMiddleware, graphSubsMiddleware];

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer,
  }),
  compose(applyMiddleware(...middlewares))
);
sagaMiddleware.run(rootSaga);
export { store, history };
