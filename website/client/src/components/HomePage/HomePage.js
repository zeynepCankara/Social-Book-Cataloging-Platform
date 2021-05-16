import React, { useEffect } from 'react'
import { List, makeStyles } from '@material-ui/core'
import { useDispatch } from 'react-redux';
import { GET_HOME_CONTENT } from '../../actions';
import { useAllReviewsSelector, usePopularBooksSelector, usePopularChallengesSelector } from '../../selectors';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        height: 'calc(100vh - 50px)'
    },
    topBooks: {
        flex: 1
    },
    reviews: {
        flex: 1.25,
        borderLeft: '1px solid rgba(100,100,100,0.8)',
        borderRight: '1px solid rgba(100,100,100,0.8)'
    },
    topChallenges: {
        flex: 1
    }
}))

export default function HomePage() {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: GET_HOME_CONTENT
        })
    }, [])

    const challenges = usePopularChallengesSelector();
    const books = usePopularBooksSelector();
    const reviews = useAllReviewsSelector();

    return (
        <div className={classes.container}>
            <List className={classes.topBooks}>
                
            </List>
            <List className={classes.reviews}>

            </List>
            <List className={classes.topChallenges}>

            </List>
        </div>
    )
}
