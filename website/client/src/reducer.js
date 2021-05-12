import { 
    SET_USERNAME,
    SET_HOME_CONTENT,
    SET_USER_INFORMATION,
    FETCH_BOOKS_SUCCESS
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
        default:
            return state || {};
    }
}