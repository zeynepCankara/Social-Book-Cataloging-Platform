import { 
    LOGIN_SUCCESS
} from './actions';

export default function reducer(state, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            const { name, password } = action.payload;
            return {
                ...state,
                username: name,
                password
            }
        default:
            return {};
    }
}