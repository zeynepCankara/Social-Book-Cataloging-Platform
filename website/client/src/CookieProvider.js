import { useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { SET_USERNAME } from './actions';
import { useDispatch } from 'react-redux';

export default function CookieProvider({children}) {
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        const cookies = new Cookies();
        const username = cookies.get('username');

        if (username) {
            dispatch({
                type: SET_USERNAME,
                username
            })
            history.push('/home');
        } else {
            history.push('/');
        }
    }, [history, dispatch]);

    return children;
}
