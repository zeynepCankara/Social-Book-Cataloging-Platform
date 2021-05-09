import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducer';
import middleware from './middleware';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = (composeWithDevTools && composeWithDevTools({
    shouldCatchErrors: true,
  })) || compose;
  
const store = createStore(
reducer,
composeEnhancers(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(middleware);

export default store;