import React from 'react'
import { Typography, makeStyles } from '@material-ui/core';
import Progress from './Progress'
import { useBookProgressSelector } from '../../selectors';

const useStyles = makeStyles((theme) => ({
    container: {
        height: 'calc(100vh - 50px)',
        display: 'flex',
        justifyContent: 'space-between'
    }
}))
export default function BookPage({book}) {
    const classes = useStyles();
    const trackInformation = useBookProgressSelector(book.bookId);

    return (
        <div  className={classes.container}>
            <div>
                <Typography variant='h2'>
                    {book.name}
                </Typography>
                <Typography variant='h4'>
                    {`by ${book.authorName}`}
                </Typography>
            </div>
            {trackInformation && <Progress trackInformation={trackInformation}/>}
        </div>
    )
}
