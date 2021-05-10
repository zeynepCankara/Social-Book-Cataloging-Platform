import React from 'react';
import { useSelector } from 'react-redux';
import Cookies from 'universal-cookie';

export default function Home() {
    const name = useSelector(state => state.username);

    const handleLogout = () => {
        const cookies = new Cookies();
        cookies.remove('username');
        window.location.reload();
    }

    return (
        <div>
            {`Hello, ${name}`}
            <button onClick={handleLogout}>
                LOGOUT
            </button>
        </div>
    )
}
