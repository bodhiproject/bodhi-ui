import { createStore as _createStore, combineReducers, applyMiddleware, compose as _compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import reducers from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [thunk, sagaMiddleware];

let compose = _compose;
if (process.env.REACT_APP_ENV === 'dev') {
  compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _compose; // eslint-disable-line
}

const createStore = () => {
  const store = _createStore(
    combineReducers(reducers),
    compose(applyMiddleware(...middlewares))
  );
  sagaMiddleware.run(rootSaga);
  return store;
};

const store = createStore();

if (process.env.REACT_APP_ENV === 'dev') {
  window.store = store;
}

export { store, createStore };
