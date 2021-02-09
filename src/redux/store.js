import {createStore, applyMiddleware} from 'redux';
import logger from 'redux-logger';
import rootReducer from '../redux/rootReducer';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './root.saga';

const sagaMiddleWare = createSagaMiddleware()

const middleWares = [sagaMiddleWare];

if(process.env.NODE_ENV === 'development') {
    middleWares.push(logger);
}

const store = createStore(rootReducer, applyMiddleware(...middleWares));
sagaMiddleWare.run(rootSaga)

export default store;