import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_BOOKS_REQUEST } from '../../actions';
import { makeStyles } from '@material-ui/core';
import Books from './Books';
import Filter from './Filter';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        height: 'calc(100vh - 50px)',
    }
}))

export default function BooksContainer() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const books = useSelector(state => state.books) || [];
    const [loading, setLoading] = useState(false);
    const [failure, setFailure] = useState(false);

    const onSuccess = () => {
        setLoading(false);
    };

    const onFailure = failure => {
        setFailure(failure);
        setLoading(false);
    }

    useEffect(() => {
        dispatch({
            type: FETCH_BOOKS_REQUEST,
            onSuccess,
            onFailure,
        });
        setLoading(true);
    }, [dispatch]);

    return (
        <div className={classes.container}>
            <Filter/>
            <Books loading={loading} books={books} failure={failure}/>
        </div>
    )
}
