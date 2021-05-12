import React from 'react'
import { Typography, makeStyles } from '@material-ui/core';
import Progress from './Progress'
import { useBookProgressSelector } from '../../selectors';

const useStyles = makeStyles((theme) => ({
    container: {
        margin: '30px',
    }
}))
export default function BookPage({book}) {
    const classes = useStyles();
    const progress = useBookProgressSelector(book.bookId);
    console.log(progress);

    return (
        <div  className={classes.container}>
            <Typography variant='h2'>
                {book.name}
            </Typography>
            <Typography variant='h4'>
                {`by ${book.authorName}`}
            </Typography>
            {progress && <Progress progress={progress}/>}
        </div>
    )
}
