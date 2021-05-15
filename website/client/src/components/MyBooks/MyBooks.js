import React, { useEffect, useState } from 'react'
import { Button, Divider, List, ListItem, ListSubheader, makeStyles, Typography } from '@material-ui/core';
import { GET_MY_BOOKS, GET_REVIEWS_FOR_BOOK } from '../../actions';
import { useDispatch } from 'react-redux';
import { useMyBooksSelector, useUserSelector } from '../../selectors';
import Book from './Book';
import RightSection from './RightSection';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        height: 'calc(100vh - 50px)',
    },
    books: {
        flex: 1,
        boxShadow: '2px 0 20px -2px #888',
        overflowY: 'scroll'
    },
    booksHeader: {
        fontSize: '30px',
        textAlign: 'right',
        padding: '20px 10px',
        fontWeight: 'bold',
        backgroundColor: 'white',
    },
    rightSection: {
        flex: 1
    }
}))
export default function MyBooks() {
    // TODO: Get all books written by this author, list them.
    // Add list all reviews button to each book. With this button, open popup and show reviews with reply option.
    // Add create edition button to each book.
    // Also implement publishing new book functionality with popup again.

    const classes = useStyles();
    const dispatch = useDispatch();
    const mybooks = useMyBooksSelector();
    const user = useUserSelector();
    const [content, setContent] = useState(false);

    useEffect(() => {
        dispatch({
            type: GET_MY_BOOKS,
            payload: {
                username: user.username
            }
        })
    }, []);


    const setReviews = bookInfo => reviews => {
        setContent({
            mode: 'listReview',
            bookInfo,
            reviews
        });
    }
    
    const handleListReview = bookInfo => () => {
        dispatch({
            type: GET_REVIEWS_FOR_BOOK,
            payload: {
                bookId: bookInfo.bookId,
                onSuccess: setReviews(bookInfo)
            }
        })

    }

    const handleAddEdition = bookInfo => () => {
        setContent({
            mode: 'addEdition',
            bookInfo
        })
    }

    const handlePublishBook = () => {
        setContent({
            mode: 'publishBook',
            authorName: user.username
        })
    }

    return (
        <div className={classes.container}>
            <RightSection content={content}/>
            <List 
                className={classes.books}
                subheader={
                    <ListSubheader color='primary' classes={{ root: classes.booksHeader}}>
                        <Button
                            variant="contained"
                            color="secondary"
                            size='large'
                            style={{fontSize: 20}}
                            onClick={handlePublishBook}
                        >
                            Publish New Book
                        </Button>
                    </ListSubheader>
                }
            >
                <Divider/>
                {mybooks.map((book, index) => {
                    return <ListItem divider style={index % 2 === 0 ? {backgroundColor: '#eee'} : {}}>
                        <Book info={book} handleListReview={handleListReview} handleAddEdition={handleAddEdition(book)} />
                    </ListItem>
                })}
            </List>
            
        </div>
    )
}
