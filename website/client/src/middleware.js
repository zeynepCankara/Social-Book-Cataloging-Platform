import { call, put, takeEvery } from 'redux-saga/effects';
import { 
    login, 
    signup,
    getAllBooks, 
    getTrackedBooks, 
    getFilteredBooks,
    getReviews,
    getEditions,
    startTracking,
    addReview,
    addProgress,
    getBooksOfAuthor,
    getReviewsForBook,
    getReplies,
    addReply,
    addEdition,
    publishBook,
    createBooklist,
    getBooklists,
    getBooklistContent,
    removeBookFromBooklist,
    addBooksToBooklist,
    getMostPopularTenBooks,
    getMostPopularTenChallenges,
    getAllReviews,
    getAvailableChallenges,
    getAllParticipantsOfChallenge,
    joinChallenge,
    createChallenge
} from './api';
import { 
    LOGIN_REQUEST, 
    LOGIN_FAILURE, 
    SIGNUP_REQUEST, 
    SIGNUP_FAILURE,
    SET_HOME_CONTENT, 
    FETCH_BOOKS_REQUEST,
    FETCH_BOOKS_SUCCESS,
    FETCH_BOOKS_FAILURE,
    SET_USERNAME,
    SET_USER_INFORMATION,
    APPLY_FILTERS,
    GET_EDITIONS,
    START_TRACKING,
    START_TRACKING_SUCCESS, 
    ADD_REVIEW,
    ADD_REVIEW_SUCCESS,
    ADD_PROGRESS,
    ADD_PROGRESS_SUCCESS,
    GET_MY_BOOKS,
    GET_MY_BOOKS_SUCCESS,
    GET_REVIEWS_FOR_BOOK,
    ADD_REPLY,
    ADD_REPLY_SUCCESS,
    ADD_EDITION,
    PUBLISH_BOOK,
    CREATE_BOOKLIST,
    GET_BOOKLISTS,
    GET_BOOKLISTS_SUCCESS,
    GET_BOOKLIST_CONTENT,
    GET_BOOKLIST_CONTENT_SUCCESS,
    DELETE_BOOK_FROM_BOOKLIST,
    ADD_BOOKS_TO_BOOKLIST,
    GET_HOME_CONTENT,
    GET_HOME_CONTENT_SUCCESS,
    GET_AVAILABLE_CHALLENGES,
    GET_AVAILABLE_CHALLENGES_SUCCESS,
    GET_ALL_PARTICIPANTS_OF_CHALLENGE,
    JOIN_CHALLENGE,
    CREATE_CHALLENGE
} from './actions';
import Cookies from 'universal-cookie';

function setCookie(key, value) {
    const cookies = new Cookies();
    cookies.set(key, value, { path: '/' });
}

function* loginMiddleware(action) {
    try {  
        const response = yield call(login, action.payload);
    
        if (response.status === 200) {
            yield put({type: SET_USERNAME, payload: action.payload });
            yield put({type: SET_HOME_CONTENT, payload: { mode: 'home' }});
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
            yield put({type: SET_USERNAME, payload: action.payload});
            yield put({type: SET_HOME_CONTENT, payload: { mode: 'home' }});
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

function* fetchUserInformation(action) {
    const { username, userType } = action.payload;
    yield call(setCookie, 'username', username);
    yield call(setCookie, 'userType', userType);

    let response = yield call(getTrackedBooks, username);

    if (response.status === 200) {
        yield put({
            type: SET_USER_INFORMATION,
            payload: {
                informationType: 'trackedBooks',
                value: response.data
            }
        })
    }

    response = yield call(getReviews, username);

    let newResults = {};
    response.data.forEach(result => {
        newResults[result.bookId] = {
            rate: result.rate,
            comment: result.comment,
            date: result.date
        }
    });

    if (response.status === 200) {
        yield put({
            type: SET_USER_INFORMATION,
            payload: { 
                informationType: 'reviews',
                value: newResults
            }
        })
    }

    if (userType === 'AUTHOR') {
        response = yield call(getReplies, {username});

        yield put({
            type: SET_USER_INFORMATION,
            payload: {
                informationType: 'replies',
                value: response.data
            }
        })
    }

    response = yield call(getBooklists, {username});

    if (response.status === 200) {
        yield put({
            type: SET_USER_INFORMATION,
            payload: {
                informationType: 'booklists',
                value: response.data
            }
        })
    }
}

function* saveHomeContent(action) {
    yield call(setCookie, 'homeContent', action.payload);
}

function* applyFilters(action) {
    const response = yield call(getFilteredBooks, action.payload);
    yield put({
        type: FETCH_BOOKS_SUCCESS,
        payload: response.data
    })

}

function* getEditionsMiddleware(action) {
    const { bookId, onSuccess } = action.payload;

    const response = yield call(getEditions, bookId);
    onSuccess(response.data);
}


function* startTrackingMiddleware(action) {
    const { edition } = action.payload;

    const response = yield call(startTracking, action.payload);

    if (response.status === 200) {
        yield put({
            type: START_TRACKING_SUCCESS,
            payload: { edition }
        })
    }
}   

function* addReviewMiddleware(action) {
    const response = yield call(addReview, action.payload);

    if (response.status === 200) {
        const { bookId, rate, comment, date } = action.payload;
        yield put({
            type: ADD_REVIEW_SUCCESS,
            payload: {
                bookId,
                content: {
                    rate,
                    comment,
                    date
                }
            }
        })
    }
}

function* addProgressMiddleware(action) {
    const response = yield call(addProgress, action.payload);

    if (response.status === 200 ) {
        yield put({
            type: ADD_PROGRESS_SUCCESS,
            payload: action.payload
        })
    }
}

function* getMyBooksMiddleware(action) {
    const response = yield call(getBooksOfAuthor, action.payload);

    if (response.status === 200) {
        yield put({
            type: GET_MY_BOOKS_SUCCESS,
            payload: response.data
        })
    }
}

function* getReviewsForBookMiddleware(action) {
    const { bookId, onSuccess } = action.payload;

    const response = yield call(getReviewsForBook, {bookId});

    if (response.status === 200) {
        console.log(response.data);
        onSuccess(response.data);
    }
}

function* addReplyMiddleware(action) {
    const response = yield call(addReply, action.payload);

    if (response.status === 200) {
        yield put({
            type: ADD_REPLY_SUCCESS,
            payload: action.payload
        })
    }
}

function* addEditionMiddleware(action) {
    const response = yield call(addEdition, action.payload);

    if (response.status === 200) {
        yield put({
            type: GET_MY_BOOKS,
            payload: {
                username: action.payload.username
            }
        })
    }
}

function* publishBookMiddleware(action) {
    const response = yield call(publishBook, action.payload);

    if (response.status === 200) {
        yield put({
            type: GET_MY_BOOKS,
            payload: {
                username: action.payload.authorName
            }
        })
    }
}

function* createBookListMiddleware(action) {
    const response = yield call(createBooklist, action.payload);

    if (response.status === 200) {
        yield put({
            type: GET_BOOKLISTS,
            payload: {
                username: action.payload.username
            }
        })
        console.log(response)
        yield put({
            type: GET_BOOKLIST_CONTENT,
            payload: {
                bookListId: response.data.booklistId
            }
        })
    }

    
}

function* getBookListsMiddleware(action) {
    const response = yield call(getBooklists, action.payload);

    if (response.status === 200) {
        yield put({
            type: GET_BOOKLISTS_SUCCESS,
            payload: response.data
        })
    }
}

function* getBooklistContentMiddleware(action) {
    const response = yield call(getBooklistContent, action.payload);

    if (response.status === 200) {
        yield put({
            type: GET_BOOKLIST_CONTENT_SUCCESS,
            payload: response.data,
            list: action.payload
        })
    }
}

function* deleteBookFromBooklistMiddleware(action) {
    const response = yield call(removeBookFromBooklist, action.payload);

    if (response.status === 200) {
        yield put({
            type: GET_BOOKLIST_CONTENT,
            payload: action.payload
        })
    }
}


function* addBooksToBooklistMiddleware(action) {
    const response = yield call(addBooksToBooklist, action.payload);

    if (response.status === 200) {
        yield put({
            type: GET_BOOKLIST_CONTENT,
            payload: {
                bookListId: action.payload.bookListId
            }
        })
    }
}

function* getHomeContentMiddleware(action) {
    const topTenBooks = yield call(getMostPopularTenBooks);

    if (topTenBooks.status !== 200) {
        return;
    }

    const topTenChallenges = yield call(getMostPopularTenChallenges);

    if (topTenChallenges.status !== 200) {
        return;
    }

    const reviews = yield call(getAllReviews);

    if (reviews.status !== 200) {
        return;
    }

    yield put({
        type: GET_HOME_CONTENT_SUCCESS,
        payload: {
            books: topTenBooks.data,
            challenges: topTenChallenges.data,
            reviews: reviews.data
        }
    })

}

function* getAvailableChallengesMiddleware(action) {
    const response = yield call(getAvailableChallenges);

    if (response.status === 200) {
        yield put({
            type: GET_AVAILABLE_CHALLENGES_SUCCESS,
            payload: response.data
        })
    }
}

function* getAllParticipantsOfChallengeMiddleware(action) {
    const response = yield call(getAllParticipantsOfChallenge, action.payload.challenge);

    action.payload.onSuccess(response.data);
}

function* joinChallengeMiddleware(action) {
    const response = yield call(joinChallenge, action.payload.data);

    if (response.status === 200) {
        action.payload.onSuccess();
    }
}

function* createChallengeMiddleware(action) {
    const response = yield call(createChallenge, action.payload)

    if (response.status === 200) {
        yield put({ type: GET_AVAILABLE_CHALLENGES})
    }
}

export default function* mainMiddleware() {
    yield takeEvery(LOGIN_REQUEST, loginMiddleware);
    yield takeEvery(SIGNUP_REQUEST, signupMiddleware);
    yield takeEvery(FETCH_BOOKS_REQUEST, fetchBook);
    yield takeEvery(SET_USERNAME, fetchUserInformation);
    yield takeEvery(SET_HOME_CONTENT, saveHomeContent);
    yield takeEvery(APPLY_FILTERS, applyFilters);
    yield takeEvery(GET_EDITIONS, getEditionsMiddleware);
    yield takeEvery(START_TRACKING, startTrackingMiddleware);
    yield takeEvery(ADD_REVIEW, addReviewMiddleware);
    yield takeEvery(ADD_PROGRESS, addProgressMiddleware);
    yield takeEvery(GET_MY_BOOKS, getMyBooksMiddleware);
    yield takeEvery(GET_REVIEWS_FOR_BOOK, getReviewsForBookMiddleware);
    yield takeEvery(ADD_REPLY, addReplyMiddleware);
    yield takeEvery(ADD_EDITION, addEditionMiddleware);
    yield takeEvery(PUBLISH_BOOK, publishBookMiddleware);
    yield takeEvery(CREATE_BOOKLIST, createBookListMiddleware);
    yield takeEvery(GET_BOOKLISTS, getBookListsMiddleware);
    yield takeEvery(GET_BOOKLIST_CONTENT, getBooklistContentMiddleware);
    yield takeEvery(DELETE_BOOK_FROM_BOOKLIST, deleteBookFromBooklistMiddleware);
    yield takeEvery(ADD_BOOKS_TO_BOOKLIST, addBooksToBooklistMiddleware);
    yield takeEvery(GET_HOME_CONTENT, getHomeContentMiddleware);
    yield takeEvery(GET_AVAILABLE_CHALLENGES, getAvailableChallengesMiddleware);
    yield takeEvery(GET_ALL_PARTICIPANTS_OF_CHALLENGE, getAllParticipantsOfChallengeMiddleware);
    yield takeEvery(JOIN_CHALLENGE, joinChallengeMiddleware);
    yield takeEvery(CREATE_CHALLENGE, createChallengeMiddleware);
}