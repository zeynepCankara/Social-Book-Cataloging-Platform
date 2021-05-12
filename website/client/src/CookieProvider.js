import { useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { SET_USERNAME, SET_HOME_CONTENT, FETCH_BOOKS_REQUEST } from './actions';
import { useDispatch } from 'react-redux';

export default function CookieProvider({children}) {
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        const cookies = new Cookies();
        const username = cookies.get('username');

        if (username) {
            const userType = cookies.get('userType');
            dispatch({
                type: SET_USERNAME,
                payload: { 
                    username,
                    userType
                }
            })
            const homeContent = cookies.get('homeContent');
            dispatch({
                type: SET_HOME_CONTENT,
                payload: homeContent
            })
            dispatch({
                type: FETCH_BOOKS_REQUEST,
                onSuccess: () => {},
                onFailure: () => {}
            })
            history.push('/home');
        } else {
            history.push('/');
        }
    }, [history, dispatch]);

    return children;
}
