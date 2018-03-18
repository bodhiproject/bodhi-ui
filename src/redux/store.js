import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { reducer as reduxFormReducer } from 'redux-form';

import reducers from './reducers';
import rootSaga from './sagas';
import { endpoint } from '../config/app';

const history = createHistory();
const sagaMiddleware = createSagaMiddleware();
const routeMiddleware = routerMiddleware(history);
const middlewares = [thunk, sagaMiddleware, routeMiddleware];

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer,
    form: reduxFormReducer,
  }),
  compose(applyMiddleware(...middlewares))
);
sagaMiddleware.run(rootSaga);
export { store, history };
