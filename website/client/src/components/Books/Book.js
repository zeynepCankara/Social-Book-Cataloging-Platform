import React, { useState } from 'react'
import { Button, makeStyles, Typography, Dialog, DialogTitle, Table, TableHead, TableRow, TableCell, TableBody, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { useBookProgressSelector, useBookReviewSelector, useUserSelector } from '../../selectors';
import { useDispatch } from 'react-redux';
import { ADD_REVIEW, GET_EDITIONS, SET_HOME_CONTENT, START_TRACKING } from '../../actions';
import Review from '../Review/Review';
import { Rating } from '@material-ui/lab';
import { convertToSQLDate } from '../../utils';

const ProgressDialog = ({
    className,
    open,
    handleClose,
    selectEdition,
    editions
}) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle className={className}>Choose an edition to start reading</DialogTitle>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Publisher</TableCell>
                        <TableCell>Page Count</TableCell>
                        <TableCell>Format</TableCell>
                        <TableCell>Language</TableCell>
                        <TableCell>Translator</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {editions.map(e => {
                        return <TableRow hover onClick={selectEdition(e)} style={{cursor: 'pointer'}}>
                            <TableCell>{e.number}</TableCell>
                            <TableCell>{e.publisher}</TableCell>
                            <TableCell>{e.pageCount}</TableCell>
                            <TableCell>{e.format}</TableCell>
                            <TableCell>{e.language}</TableCell>
                            <TableCell>{e.translator}</TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </Dialog>)
}

const ReviewDialog = ({
    user,
    open,
    handleClose,
    review,
    bookInfo,
    onNewReview
}) => {
    const [rate, setRate] = useState(0);
    const [comment, setComment] = useState('');



    return <Dialog open={open} onClose={handleClose}>
        {review ? <Review
            bookInfo={bookInfo}
            {...review}
            username={user.username}
        /> : 
        <div>
            <DialogTitle>
                Add Review for <b>{bookInfo.name}</b>
            </DialogTitle>
            <DialogContent dividers>
                <Rating
                    onChange={(event, newValue) => setRate(newValue)}
                    value={rate}
                />
                <TextField
                    onChange={e => setComment(e.target.value)}
                    value={comment}
                    placeholder={`Please enter your thoughts about ${bookInfo.name}`}
                    fullWidth
                    color="primary" 
                    autoFocus
                    multiline 
                    rows={4}
                    rowsMax={8}
                    variant="outlined"
                    size="medium"
                    style={{ marginTop: '10px'}}
                />
            </DialogContent>
            <DialogActions>
                <Button 
                    variant="contained"
                    color="primary" 
                    onClick={e => {
                        onNewReview(rate, comment);
                        handleClose();
                    }}
                >Review</Button>
            </DialogActions>
        </div>
        }
    </Dialog>
}

const useStyles = makeStyles((theme) => ({
    container: {
        width: '520px',
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
    },
    progressPopupTitle: {
        '& h2': {
            fontWeight: 'bold',
        }
    }
}))

export default function Book({info, className}) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const isTracked = useBookProgressSelector(info.bookId);
    const review = useBookReviewSelector(info.bookId);
    const user = useUserSelector();
    const [editions, setEditions] = useState([]);
    const [progressPopupIsOpen, toggleProgressPopup] = useState(false);
    const [reviewPopupIsOpen, toggleReviewPopup] = useState(false);

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
            dispatch({
                type: GET_EDITIONS,
                payload: {
                    bookId: info.bookId,
                    onSuccess: editionsFetched
                }
            });
        }
    }

    const editionsFetched = editions => {
        setEditions(editions);
        toggleProgressPopup(true);
    }

    const selectEditionForProgress = edition => () => {
        dispatch({
            type: START_TRACKING,
            payload: {
                username: user.username,
                edition
            }
        })
        toggleProgressPopup(false);
    }

    const handleNewReview = (rate, comment) => {
        dispatch({
            type: ADD_REVIEW,
            payload: {
                username: user.username,
                bookId: info.bookId,
                rate,
                comment,
                date: convertToSQLDate(Date.now())
            }
        })
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
                    color={review ? 'primary': 'secondary'}
                    onClick={() => toggleReviewPopup(true)}
                >
                    {review ? 'See Review' : 'Review'}
                </Button>
            </div>
            <ProgressDialog
                className={classes.progressPopupTitle}
                open={progressPopupIsOpen}
                handleClose={() => toggleProgressPopup(false)}
                selectEdition={selectEditionForProgress}
                editions={editions}
            />
            <ReviewDialog
                open={reviewPopupIsOpen}
                handleClose={() => toggleReviewPopup(false)}
                review={review}
                bookInfo={info}
                user={user}
                onNewReview={handleNewReview}
            />

        </div>
    )
}
