import { 
    LOGIN_SUCCESS,
    SET_USERNAME,
    SIGNUP_SUCCESS
} from './actions';

export default function reducer(state, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            const { name } = action.payload;
            return {
                ...state,
                username: name,
            }
        case SIGNUP_SUCCESS:
            return {
                ...state,
                username: action.payload.name,
            }
        case SET_USERNAME:
            return {
                ...state,
                username: action.username
            }
        default:
            return {};
    }
}