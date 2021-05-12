import React from 'react'
import { makeStyles, CircularProgress } from '@material-ui/core';
import Book from './Book';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        flex: 0.7,
        overflowY: 'scroll',
        padding: '10px 20px',
        backgroundColor: '#ddd',
        boxShadow: '2px 0 20px 2px #888', 
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#1976D2',
        fontSize: '30px'
    },
    list: {
        width: '100%',
        height: '100%',
        display: 'grid',
        gridGap: '10px',
        gridTemplateColumns: 'auto auto auto',
    },
}))

export default function Books({loading, books, failure}) {
    const classes = useStyles();
    let populated = books;
    let i = 0;
    for (i = 0; i < 10; i++) {
        populated = [...populated, ...books];
    }
    return (
        <div className={classes.container}>
            {loading ?
                <div className={classes.loading}>
                    <CircularProgress 
                        size={100} 
                        thickness={5}
                    />
                    Loading...
                </div> :
                <div className={classes.list}>
                    {populated.map(book => <Book info={book} className={classes.item} />)}
                </div>
            }
        </div>
    )
}
