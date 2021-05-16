import React, { useEffect, useState } from 'react'
import { Typography, makeStyles, Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, Card, Button, TextField } from '@material-ui/core';
import Progress from './Progress'
import { useBookProgressSelector, useTradesSelector, useUserSelector } from '../../selectors';
import { useDispatch } from 'react-redux';
import { BUY_BOOK, GET_EDITIONS, GET_TRADES, SELL_BOOK } from '../../actions';

const useStyles = makeStyles((theme) => ({
    container: {
        height: 'calc(100vh - 50px)',
        display: 'flex',
        justifyContent: 'space-between',
    },
    leftPart: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    tab: {
        backgroundColor: theme.palette.primary.main,
        color: 'white'
    },
    bottomPart: {
        backgroundColor: 'rgba(56,33,16,0.2)',
        flex: 1,
        overflow: 'auto'
    },
    trades: {
        padding: 20,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gridGap: 20
    },
    trade: {
        padding: 10,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 200
    },
    sell: {
        padding: 10,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    }
}))

export default function BookPage({book}) {
    const classes = useStyles();
    const trackInformation = useBookProgressSelector(book.bookId);
    const [value, setValue] = useState(0);
    const [editions, setEditions] = useState([]);
    const dispatch = useDispatch();
    const trades = useTradesSelector();
    const user = useUserSelector();
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    useEffect(() => {
        dispatch({
            type: GET_EDITIONS,
            payload: {
                bookId: book.bookId,
                onSuccess: setEditions
            }
        })
        dispatch({
            type: GET_TRADES,
            payload: {
                bookId: book.bookId
            }
        })
    }, [])
    
    const handleBuy = trade => () => {
        dispatch({
            type: BUY_BOOK,
            payload: {
                ...trade,
                username: user.username
            }
        })
    }

    const sellBook = () => {
        dispatch({
            type: SELL_BOOK,
            payload: {
                username: user.username,
                price,
                description,
                bookId: book.bookId
            }
        })
    }

    return (
        <div className={classes.container}>
            <div className={classes.leftPart}>
                <div style={{ padding: '20px 20px 10px 20px', backgroundColor: 'rgba(56,33,16,0.2)'}}>
                    <Typography variant='h3'>
                        <b>{book.name}</b>
                    </Typography>
                    <Typography variant='h5'>
                        {`by ${book.authorName} (${book.year})`}
                    </Typography>
                    <Typography variant='h5'>
                        {`Genre: ${book.genre}`}
                    </Typography>
                </div>
                <Tabs value={value} onChange={handleChange} variant='fullWidth'>
                    <Tab label='Editions' color='primary' classes={{root: classes.tab, selected: classes.selectedTab}}/>
                    <Tab label='Offers' classes={{root: classes.tab, selected: classes.selectedTab}}/>
                </Tabs>
                <div className={classes.bottomPart}>
                    {value === 0 && <Table style={{backgroundColor: 'white'}}>
                        <TableHead>
                            <TableRow>
                                <TableCell align='center' style={{fontWeight: 'bold'}}>Edition Number</TableCell>
                                <TableCell align='center' style={{fontWeight: 'bold'}}>Publisher</TableCell>
                                <TableCell align='center' style={{fontWeight: 'bold'}}>Page Count</TableCell>
                                <TableCell align='center' style={{fontWeight: 'bold'}}>Format</TableCell>
                                <TableCell align='center' style={{fontWeight: 'bold'}}>Language</TableCell>
                                <TableCell align='center' style={{fontWeight: 'bold'}}>Translator</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {editions.map(e => {
                                return <TableRow hover>
                                    <TableCell align='center'>{e.number}</TableCell>
                                    <TableCell align='center'>{e.publisher}</TableCell>
                                    <TableCell align='center'>{e.pageCount}</TableCell>
                                    <TableCell align='center'>{e.format}</TableCell>
                                    <TableCell align='center'>{e.language}</TableCell>
                                    <TableCell align='center'>{e.translator}</TableCell>
                                </TableRow>
                            })}
                        </TableBody>
                    </Table>}   
                    {value === 1 && <div className={classes.trades}>
                        {trades.map(e => {
                            return <Card className={classes.trade} elevation={10}>
                                <Typography align='center' variant='h5' style={{fontWeight: 'bold'}}>
                                    {e.description}
                                </Typography>
                                <Typography align='center' variant='h6'>
                                    {`from ${e.userName}`}
                                </Typography>
                                <div style={{flex: 1}}/>
                                <Typography variant='h6' style={{margin: '15px 0'}} align='center'>
                                    Price: <b>{`${e.price}$`}</b>
                                </Typography>
                                <Button
                                    variant='contained'
                                    fullWidth
                                    color='secondary'
                                    onClick={handleBuy(e)}
                                    disabled={user.username === e.userName}
                                >BUY</Button>
                            </Card>
                        }).concat(<Card className={classes.sell} elevation={10}>
                            <Typography align='center' variant='h5' style={{fontWeight: 'bold'}}>
                                Sell This Book
                            </Typography>
                            <TextField
                                type='number'
                                variant='outlined'
                                label='Price'
                                size='small'
                                onChange={e => setPrice(e.target.value)}
                                value={price}
                            />
                            <TextField
                                multiline
                                rows={2}
                                variant='outlined'
                                label='Description'
                                size='small'
                                fullWidth
                                onChange={e => setDescription(e.target.value)}
                                value={description}
                            />
                            <Button
                                color='primary'
                                variant='contained'
                                fullWidth
                                onClick={sellBook}
                            >
                                Sell
                            </Button>
                        </Card>).reverse()}    
                    </div>}
                </div>
            </div>
            {trackInformation && <Progress trackInformation={trackInformation}/>}
        </div>
    )
}
