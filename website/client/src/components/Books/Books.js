import React from 'react'
import { makeStyles, CircularProgress } from '@material-ui/core';
import Book from './Book';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        flex: 0.6,
        overflowY: 'scroll',
        paddingTop: '10px'
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    item: {
        margin: '10px 0',
    }
}))

export default function Books({loading, books, failure}) {
    const classes = useStyles();
    console.log(books);
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
                    {books.map(book => <Book info={book} className={classes.item} />)}
                </div>
            }
        </div>
    )
}
