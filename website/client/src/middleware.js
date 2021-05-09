import { call, put, takeEvery } from 'redux-saga/effects';
import { login, signup } from './api';
import { LOGIN_REQUEST, LOGIN_FAILURE, LOGIN_SUCCESS, SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE } from './actions';

function* loginMiddleware(action) {
    try {  
        const response = yield call(login, action.payload);
    
        if (response.status === 200) {
            yield put({type: LOGIN_SUCCESS, payload: action.payload});
            action.history.push('/home');
        } else {
            yield put({type: LOGIN_FAILURE, payload: response.data});
            action.onError(response.data);
        }
    } catch (error) {
        yield put({type: LOGIN_FAILURE, payload: error.message});
        action.onError(error.message);
    }
}

function* signupMiddleware(action) {
    try {
        const response = yield call(signup, action.payload);

        if (response.status === 200) {
            yield put({type: SIGNUP_SUCCESS, payload: action.payload});
            action.history.push('/home');
        } else {
            yield put({type: SIGNUP_FAILURE, payload: response.data})
            action.onError(response.data);
        }
    } catch (error) {
        yield put({type: SIGNUP_FAILURE, payload: error.message});
        action.onError(error.message);
    }
}

export default function* mainMiddleware() {
    yield takeEvery(LOGIN_REQUEST, loginMiddleware);
    yield takeEvery(SIGNUP_REQUEST, signupMiddleware);
}