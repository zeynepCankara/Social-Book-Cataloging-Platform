import React from 'react'
import { makeStyles, CircularProgress } from '@material-ui/core';
import Book from './Book';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        flexBasis: '75%',
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
        height: 'fit-content',
        display: 'grid',
        gridGap: '10px',
        gridRowGap: '5px',
        gridTemplateColumns: 'auto auto',
    },
}))

export default function Books({loading, books, failure}) {
    const classes = useStyles();
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
