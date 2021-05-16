import React, { useEffect } from 'react'
import { Card, List, ListItem, ListSubheader, makeStyles, Typography } from '@material-ui/core'
import { useDispatch } from 'react-redux';
import { GET_HOME_CONTENT } from '../../actions';
import { useAllReviewsSelector, useBookFromBookId, useBookSelector, usePopularBooksSelector, usePopularChallengesSelector } from '../../selectors';
import Review from '../Review/Review';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        height: 'calc(100vh - 50px)'
    },
    side: {
        overflowY: 'auto',
        minWidth: 430,
    },
    reviews: {
        flex: 1,
        borderLeft: '1px solid rgba(100,100,100,0.8)',
        borderRight: '1px solid rgba(100,100,100,0.8)',
        overflowY: 'auto',
        padding: 20,
    },
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
    const bookInfos = useBookSelector();

    return (
        <div className={classes.container}>
            <List className={classes.side}
                subheader={
                    <ListSubheader style={{borderBottom: '1px solid', backgroundColor: 'white', padding: 20}}>
                        <Typography variant='h5' align='center' color='primary'><b>Most Popular 10 Challenges</b></Typography>
                    </ListSubheader>
                }
            >
                {challenges.map((e,index) => {
                    return <ListItem divider style={{display: 'block', paddingLeft: 20, backgroundColor: index % 2 === 1 ? '#eee' : '#fff'}}>
                        <Typography variant="h5" style={{fontWeight: 'bold'}}>{e.name}</Typography>
                        <Typography>{`${e.totalParticipant} participants`}</Typography>
                    </ListItem>
                })}
            </List>
            <List className={classes.reviews}>
                {reviews.map(e => {
                    return <div>
                        <Review
                            username={e.userName}
                            bookInfo={bookInfos.filter(book => book.bookId === e.bookId)[0] || []}
                            {...e}
                        />
                        <div style={{height: 10}}/>
                    </div>
                })}
            </List>
            <List 
                className={classes.side}
                subheader={
                    <ListSubheader style={{borderBottom: '1px solid', backgroundColor: 'white', padding: 20}}>
                        <Typography variant='h5' align='center' color='primary'><b>Most Popular 10 Books</b></Typography>
                    </ListSubheader>
                }
            >
                {books.map((e, index) => {
                    return <ListItem divider style={{display: 'block', paddingLeft: 20, backgroundColor: index % 2 === 1 ? '#eee' : '#fff'}}>
                        <Typography variant="h5"><b>{e.name}</b></Typography>
                        <Typography variant='h6'>{`by ${e.authorName}`}</Typography>
                        <Typography style={{fontSize: 15, color: 'rgba(150,150,150,0.8)'}}>{`${e.totalTrack} people reads this book`}</Typography>
                    </ListItem>
                })}
            </List>
        </div>
    )
}
