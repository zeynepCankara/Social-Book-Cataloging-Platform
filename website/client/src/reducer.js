import { 
    SET_USERNAME,
    SET_HOME_CONTENT,
    SET_USER_INFORMATION
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
            return {
                ...state,
                user: {
                    ...state.user,
                    name: action.username
                }
            }
        case SET_HOME_CONTENT:
            return {
                ...state,
                homeContent: action.payload
            }
        default:
            return state || {};
    }
}