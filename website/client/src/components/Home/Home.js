import React from 'react';
import { useSelector } from 'react-redux';

export default function Home() {
    const name = useSelector(state => state.username);
    return (
        <div>
            {`Hello, ${name}`}
        </div>
    )
}
