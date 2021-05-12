import { call, put, takeEvery } from 'redux-saga/effects';
import { login, signup, getAllBooks } from './api';
import { 
    LOGIN_REQUEST, 
    LOGIN_FAILURE, 
    LOGIN_SUCCESS, 
    SIGNUP_REQUEST, 
    SIGNUP_SUCCESS,
    SIGNUP_FAILURE,
    SET_HOME_CONTENT, 
    FETCH_BOOKS_REQUEST,
    FETCH_BOOKS_SUCCESS,
    FETCH_BOOKS_FAILURE} from './actions';
import Cookies from 'universal-cookie';

function setCookie(key, value) {
    const cookies = new Cookies();
    cookies.set(key, value, { path: '/' });
}

function* loginMiddleware(action) {
    try {  
        const response = yield call(login, action.payload);
    
        if (response.status === 200) {
            yield put({type: LOGIN_SUCCESS, payload: action.payload});
            yield put({type: SET_HOME_CONTENT, payload: { mode: 'home' }});
            yield call(setCookie, 'username', action.payload.name);
            action.history.push('/home');
        }
    } catch (error) {
        const errorMessage = error.response.data || error.message;
        yield put({type: LOGIN_FAILURE, payload: errorMessage });
        action.onError(errorMessage);
    }
}

function* signupMiddleware(action) {
    try {
        const response = yield call(signup, action.payload);

        if (response.status === 200) {
            yield put({type: SIGNUP_SUCCESS, payload: action.payload});
            yield put({type: SET_HOME_CONTENT, payload: { mode: 'home' }});
            yield call(setCookie, 'username', action.payload.name);
            action.history.push('/home');
        }
    } catch (error) {
        const errorMessage = error.response.data || error.message;
        yield put({type: SIGNUP_FAILURE, payload: errorMessage});
        action.onError(errorMessage);
    }
}

function* fetchBook(action) {
    try {
        const response = yield call(getAllBooks);

        if (response.status === 200) {
            yield put({type: FETCH_BOOKS_SUCCESS, payload: response.data});
            action.onSuccess(response.data);
        }
    } catch (error) {
        const errorMessage = error.response.data || error.message;
        yield put({type: FETCH_BOOKS_FAILURE, payload: errorMessage});
        action.onFailure(errorMessage);
    }
}

export default function* mainMiddleware() {
    yield takeEvery(LOGIN_REQUEST, loginMiddleware);
    yield takeEvery(SIGNUP_REQUEST, signupMiddleware);
    yield takeEvery(FETCH_BOOKS_REQUEST, fetchBook);
}