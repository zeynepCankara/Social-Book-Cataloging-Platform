import { Button, Table, TableHead, Typography, TableRow, TableCell, TableBody, TableFooter } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { GET_EDITIONS } from '../../actions';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    header: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 20
    }
}))

export default function Book({info, handleListReview}) {
    const classes = useStyles();
    const [editions, setEditions] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: GET_EDITIONS,
            payload: {
                bookId: info.bookId,
                onSuccess: setEditions
            }
        })
    }, [])

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <Typography variant="h5"><b>{info.name}</b></Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleListReview(info)}
                >
                    List Reviews
                </Button>
            </div>
            <Typography variant='h6'><b>Editions</b></Typography>
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
                        return <TableRow>
                            <TableCell>{e.number}</TableCell>
                            <TableCell>{e.publisher}</TableCell>
                            <TableCell>{e.pageCount}</TableCell>
                            <TableCell>{e.format}</TableCell>
                            <TableCell>{e.language}</TableCell>
                            <TableCell>{e.translator}</TableCell>
                        </TableRow>
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={6} style={{padding: 5}}>
                            <Button variant="contained" color="secondary">ADD NEW EDITION</Button>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}
