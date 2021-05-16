import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListSubheader, makeStyles, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { CREATE_BOOKLIST, GET_BOOKLIST_CONTENT, DELETE_BOOK_FROM_BOOKLIST, FETCH_BOOKS_REQUEST, RESET_CURRENT_LIST_CONTENT, ADD_BOOKS_TO_BOOKLIST } from '../../actions';
import { useBooklistsSelector, useCurrentListContentSelector, useUserSelector, useCurrentListSelector } from '../../selectors';
import { convertToSQLDate, parseDate } from '../../utils';
import DeleteIcon from '@material-ui/icons/Delete';
import { useBookSelector } from '../../selectors';

const AddBookDialog = ({
    open,
    handleClose,
    list,
    currentListContent
}) => {
    const books = useBookSelector();
    const dispatch = useDispatch();
    const [selectedBooks, setSelectedBooks] = useState([]);
    const handleBookSelect = bookId => () => {
        if (currentListContent.map(e => e.bookId).includes(bookId)) {
            return;
        }
        if (selectedBooks.includes(bookId)) {
            setSelectedBooks(selectedBooks.filter(id => id !== bookId));
        } else {
            setSelectedBooks([...selectedBooks, bookId])
        }
    }
    const handleAdd = () => {
        if (selectedBooks.length === 0) {
            return;
        }
        dispatch({
            type: ADD_BOOKS_TO_BOOKLIST,
            payload: {
                bookIds: selectedBooks,
                bookListId: list.bookListId
            }
        })
        setSelectedBooks([]);
        handleClose();
    }

    return (
        <Dialog open={open} onClose={() => {
            setSelectedBooks([]);
            handleClose();
        }} maxWidth={false}>
            <DialogTitle>
                <Typography align="center" variant="h5">
                    Select books you want to add to <b>{list.name}</b>
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Book ID</TableCell>
                            <TableCell align="center">Book Name</TableCell>
                            <TableCell align="center">Genre</TableCell>
                            <TableCell align="center">Author</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map(book => {
                            return <TableRow 
                                hover
                                onClick={handleBookSelect(book.bookId)}
                                style={{
                                    backgroundColor: (currentListContent.map(e => e.bookId).includes(book.bookId) || selectedBooks.includes(book.bookId)) && '#ccc',
                                    cursor: 'pointer'
                                }}
                            >
                                <TableCell align="center">{book.bookId}</TableCell>
                                <TableCell align="center">{book.name}</TableCell>
                                <TableCell align="center">{book.genre}</TableCell>
                                <TableCell align="center">{book.authorName}</TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={handleAdd}
                >Add</Button>
            </DialogActions>
        </Dialog>)
}

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        height: 'calc(100vh - 50px)'
    },
    newList: {
        width: 500,
        padding: '40px 30px'
    },
    leftSide: {
        width: '100%',
        boxShadow: '2px 0 20px 2px #888',
        display: 'flex',
    },
    list: {
        width: 300,
        borderRight: '1px solid',
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto'
    },
    listItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        '&:hover': {
            backgroundColor: '#ccc !important'
        }
    },
    table: {
        padding: 10,
    }
}))

export default function Booklist() {
    useEffect(() => {
        return () => {
            dispatch({
                type: RESET_CURRENT_LIST_CONTENT
            })
        }
    }, []);
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = useUserSelector();
    const lists = useBooklistsSelector();
    const currentListContent = useCurrentListContentSelector();
    const currentList = useCurrentListSelector();
    const [addBookIsOpen, toggleAddBookPopup] = useState(false);

    const [info, setInfo] = useState({
        name: '',
        description: '',
    });

    const setValue = type => e => {
        setInfo({
            ...info,
            [type]: e.target.value
        })
        
    }

    const handleSubmit = () => {
        if (info.name !== '' && info.description !== '') {
            dispatch({
                type: CREATE_BOOKLIST,
                payload: {
                    name: info.name,
                    date: convertToSQLDate(Date.now()),
                    description: info.description,
                    username: user.username
                }
            })
        }
    }

    const handleListSelect = list => () => {
        dispatch({
            type: GET_BOOKLIST_CONTENT,
            payload: list
        })
    }

    const handleListElementDelete = element => () => {
        dispatch({
            type: DELETE_BOOK_FROM_BOOKLIST,
            payload: element
        })
    }

    const handleAddBook = () => {
        dispatch({
            type: FETCH_BOOKS_REQUEST,
            onSuccess: e => e
        })
        toggleAddBookPopup(true);
    }
    return (
        <div className={classes.container}>
            <div className={classes.leftSide}>
                <List className={classes.list} subheader={<ListSubheader style={{paddingTop: 20, margin: '0 20px', borderBottom: '1px solid'}}>
                    <Typography variant='h4' color='primary' align='center'>
                        My Lists
                    </Typography>
                </ListSubheader>}>
                    {lists.map((e, index) => {
                        return <ListItem 
                            style={{backgroundColor: currentList.bookListId === e.bookListId ? '#ccc' : (index % 2 === 1 ? '#eee' : 'white')}} 
                            className={classes.listItem} 
                            button 
                            divider
                            onClick={handleListSelect(e)}
                        >
                            <Typography variant="h5">
                                <b>{e.name}</b>
                            </Typography>
                            <Typography variant="subheader1">
                                {e.description}
                            </Typography>
                            <div style={{color: 'grey', fontSize: 12, marginTop: 5, marginLeft: 2}}>
                                {`Creation Date: ${parseDate(e.creationDate)}`}
                            </div>
                        </ListItem>
                    })}
                </List>
                {
                    currentListContent ? 
                    <div style={{overflowY: 'auto', width: '100%'}}>
                        <Table className={classes.table} stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" style={{fontWeight: 'bold', fontSize: 20}}>Book ID</TableCell>
                                    <TableCell align="center" style={{fontWeight: 'bold', fontSize: 20}}>Book Name</TableCell>
                                    <TableCell align="center" style={{fontWeight: 'bold', fontSize: 20}}>Genre</TableCell>
                                    <TableCell align="center" style={{fontWeight: 'bold', fontSize: 20}}>Author</TableCell>
                                    <TableCell align="center" style={{fontWeight: 'bold', fontSize: 20}}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentListContent.map(e => {
                                    return <TableRow>
                                        <TableCell align="center" style={{fontSize: 20}}>{e.bookId}</TableCell>
                                        <TableCell align="center" style={{fontSize: 20}}>{e.name}</TableCell>
                                        <TableCell align="center" style={{fontSize: 20}}>{e.genre}</TableCell>
                                        <TableCell align="center" style={{fontSize: 20}}>{e.authorName}</TableCell>
                                        <TableCell><IconButton><DeleteIcon color='error' onClick={handleListElementDelete(e)}/></IconButton></TableCell>
                                    </TableRow>
                                })}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={5} style={{textAlign: 'center', position: 'sticky', bottom: 0, backgroundColor: 'white'}}>
                                        <Button
                                            variant='contained'
                                            color='secondary'
                                            size='large'
                                            onClick={handleAddBook}
                                        >Add Books</Button>
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                    :
                    <Typography variant="h3" align="center" style={{width: '100%', paddingTop: '25%', color: 'rgba(200, 200, 200, 0.7)'}}>
                        Select a list to see content
                    </Typography>
                }

            </div>
            <div className={classes.newList}>
                <Typography variant='h4' align='center' style={{ borderBottom: '3px solid'}}>
                    Create New List
                </Typography>
                <TextField
                    variant="outlined"
                    fullWidth
                    label='Booklist Name'
                    margin='normal'
                    onChange={setValue('name')}
                    value={info.name || ''}
                />
                <TextField
                    multiline
                    rows={4}
                    placeholder='Enter description'
                    variant="outlined"
                    fullWidth
                    label='Description'
                    margin='normal'
                    onChange={setValue('description')}
                    value={info.description || ''}
                />
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    CREATE
                </Button>
            </div>
            <AddBookDialog
                open={addBookIsOpen}
                handleClose={() => toggleAddBookPopup(false)}
                currentListContent={currentListContent || []}
                list={currentList}
            />
        </div>
    )
}
