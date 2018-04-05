import { createStore, combineReducers, applyMiddleware, compose as _compose } from 'redux';
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
let compose = _compose;
if (process.env.REACT_APP_ENV === 'dev') {
  compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _compose; // eslint-disable-line
}

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
if (process.env.REACT_APP_ENV === 'dev') {
  window.store = store;
}
