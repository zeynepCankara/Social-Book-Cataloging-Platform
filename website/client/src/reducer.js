import { 
    SET_USERNAME,
    SET_HOME_CONTENT,
    SET_USER_INFORMATION,
    FETCH_BOOKS_SUCCESS,
    START_TRACKING_SUCCESS,
    ADD_REVIEW_SUCCESS,
    ADD_PROGRESS_SUCCESS,
    GET_MY_BOOKS_SUCCESS,
    ADD_REPLY_SUCCESS
} from './actions';

export default function reducer(state, action) {
    switch (action.type) {
        case SET_USER_INFORMATION:
            const { informationType, value } = action.payload;
            return {
                ...state,
                user: {
                    ...state.user,
                    [informationType]: value,
                }
            }
        case SET_USERNAME:
            const { username, userType } = action.payload;
            return {
                ...state,
                user: {
                    ...state.user,
                    username,
                    userType
                }
            }
        case SET_HOME_CONTENT:
            return {
                ...state,
                homeContent: action.payload
            }
        case FETCH_BOOKS_SUCCESS:
            return {
                ...state,
                books: action.payload
            }
        case START_TRACKING_SUCCESS:
            const { edition } = action.payload;
            return {
                ...state,
                user: {
                    ...state.user,
                    trackedBooks: {
                        ...state.user.trackedBooks,
                        [edition.bookId]: {
                            edition,
                            progresses: []
                        }
                    }
                }
            }
        case ADD_REVIEW_SUCCESS:
            return {
                ...state,
                user: {
                    ...state.user,
                    reviews: {
                        ...state.user.reviews,
                        [action.payload.bookId]: action.payload.content
                    }
                }
            }
        case ADD_PROGRESS_SUCCESS:
            const newProgresses = [...state.user.trackedBooks[action.payload.bookId].progresses, {
                pageNumber: action.payload.pageNumber,
                date: action.payload.date
            }];
            return {
                ...state,
                user: {
                    ...state.user,
                    trackedBooks: {
                        ...state.user.trackedBooks,
                        [action.payload.bookId]: {
                            ...state.user.trackedBooks[action.payload.bookId],
                            progresses: newProgresses
                        }
                    }
                }
            }
        case GET_MY_BOOKS_SUCCESS:
            return {
                ...state,
                user: {
                    ...state.user,
                    mybooks: action.payload
                }
            }
        case ADD_REPLY_SUCCESS:
            const newReplies = [...state.user.replies, action.payload];
            return {
                ...state,
                user: {
                    ...state.user,
                    replies: newReplies
                }
            }
        default:
            return state || {};
    }
}