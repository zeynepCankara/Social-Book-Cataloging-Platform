import { call, put, takeEvery } from 'redux-saga/effects';
import { login } from './api';
import { LOGIN_REQUEST, LOGIN_FAILURE, LOGIN_SUCCESS } from './actions';

function* loginMiddleware(action) {
    try {  
        const { name, password } = action.payload;
        const response = yield call(login, name, password);
    
        if (response.status === 200) {
            yield put({type: LOGIN_SUCCESS, payload: action.payload});
            action.history.push('/home');
        } else {
            yield put({type: LOGIN_FAILURE, payload: response.data})
        }
    } catch (error) {
        yield put({type: LOGIN_FAILURE, payload: error.message})
    }
}

export default function* mainMiddleware() {
    yield takeEvery(LOGIN_REQUEST, loginMiddleware);
}