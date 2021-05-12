import React from 'react'
import { Button, makeStyles, Typography } from '@material-ui/core';
import { useBookProgressSelector, useBookReviewSelector } from '../../selectors';
import { useDispatch } from 'react-redux';
import { SET_HOME_CONTENT } from '../../actions';

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
        height: '150px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 30px -5px #ccc',
        backgroundColor: 'white',
        borderRadius: '5px',
        boxSizing: 'border-box'
    },
    name: {
        fontSize: '25px',
        fontWeight: 'bold',
        '&:hover': {
            cursor: 'pointer',
            textDecoration: 'underline'
        }
    },
    actions: {
        marginTop: '10px',
        display: 'flex',
        justifyContent: 'space-between'
    },
    actionButton: {
        width: '48%'
    }
}))
export default function Book({info, className}) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const isTracked = useBookProgressSelector(info.bookId);
    const isReviewed = useBookReviewSelector(info.bookId);

    const goToBookPage = () => {
        dispatch({
            type: SET_HOME_CONTENT,
            payload: { 
                mode: 'book',
                book: info
            }
        })
    }

    const handleStartProgress = () => {
        if (isTracked) {
            goToBookPage();
        } else {
            // TODO: Open popup, select edition and dispatch START_TRACKING
        }
    }

    const handleReview = () => {
        if (isReviewed) {
            // TODO: Open popup and show review
        } else {
            // TODO: Open popup and get review from user and dispatch ADD_REVIEW
        }
    }

    return (
        <div className={`${classes.container} ${className || ''}`}>
            <Typography className={classes.name} onClick={goToBookPage}>{info.name }</Typography>
            <Typography className={classes.author}>{`by ${info.authorName} (${info.year})`}</Typography>
            <div style={{flex: 1}}/>
            <div className={classes.actions}>
                <Button
                    className={classes.actionButton}
                    variant='contained'
                    color={isTracked ? 'primary': 'secondary'}
                    onClick={handleStartProgress}
                >
                    {isTracked ? 'See Progress' : 'Start Reading'}
                </Button>
                <Button 
                    className={classes.actionButton} 
                    variant='contained' 
                    color={isReviewed ? 'primary': 'secondary'}
                    onClick={handleReview}
                >
                    {isReviewed ? 'See Review' : 'Review'}
                </Button>
            </div>
        </div>
    )
}
