import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { reducer as reduxFormReducer } from 'redux-form';

import reducers from './reducers';
import rootSaga from './sagas';

const history = createHistory();
const sagaMiddleware = createSagaMiddleware();
const routeMiddleware = routerMiddleware(history);
const middlewares = [thunk, sagaMiddleware, routeMiddleware];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer,
    form: reduxFormReducer,
  }),
  composeEnhancers(applyMiddleware(...middlewares)),
);
sagaMiddleware.run(rootSaga);
export { store, history };
window.store = store;
