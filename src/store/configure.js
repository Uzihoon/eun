import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import * as modules from "./modules";
import createSagaMiddleware from "redux-saga";
import saga from "./saga";

const reducers = combineReducers(modules);

const isDev = process.env.NODE_ENV === "development";
const devtools = isDev && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const composeEnhancers = devtools || compose;
const sagaMiddleware = createSagaMiddleware();

export default function configure(preloadedState) {
  const store = createStore(
    reducers,
    preloadedState,
    composeEnhancers(applyMiddleware(sagaMiddleware))
  );
  sagaMiddleware.run(saga);
  return store;
}
