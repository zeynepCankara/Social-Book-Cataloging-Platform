import { Button, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { ADD_EDITION } from '../../actions';
import { useUserSelector } from '../../selectors';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: '20px 10px',
        overflow: 'hidden'
    }
}))

export default function NewEdition({bookInfo}) {
    const classes = useStyles();
    const [info, setInfo] = useState({
        number: '',
        publisher: '',
        pageCount: '',
        format: '',
        language: '',
    });
    const [errored,setErrored] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const user = useUserSelector();
    const dispatch = useDispatch();

    const handleSubmit = () => {
        if (info.number === '') {
            setErrored(true);
            setErrorMessage('Enter a edition number!')
            return;
        }

        if (info.publisher === '') {
            setErrored(true);
            setErrorMessage('Enter a publisher!')
            return;
        }
        
        if (info.pageCount === '') {
            setErrored(true);
            setErrorMessage('Enter a page count!')
            return;
        }
        
        if (info.format === '') {
            setErrored(true);
            setErrorMessage('Enter a format!')
            return;
        }
        
        if (info.language === '') {
            setErrored(true);
            setErrorMessage('Enter a language!')
            return;
        }

        dispatch({
            type: ADD_EDITION,
            payload: {
                ...info,
                bookId: bookInfo.bookId,
                username: user.username
            }
        })


    }

    const setValue = type => e => {
        setErrored(false);
        setInfo({
            ...info,
            [type]: e.target.value
        })
        
    }

    return (
        <div className={classes.container}>
            <TextField
                type='number'
                variant="outlined"
                fullWidth
                label='Edition Number'
                margin='normal'
                onChange={setValue('number')}
                value={info.number || ''}
            />
            <TextField
                variant="outlined"
                fullWidth
                label='Publisher'
                margin='normal'
                onChange={setValue('publisher')}
                value={info.publisher || ''}
            />
            <TextField
                type='number'
                variant="outlined"
                fullWidth
                label='Page Count'
                margin='normal'
                onChange={setValue('pageCount')}
                value={info.pageCount || ''}
            />
            <TextField
                variant="outlined"
                fullWidth
                label='Format'
                margin='normal'
                onChange={setValue('format')}
                value={info.format || ''}
            />
            <TextField
                variant="outlined"
                fullWidth
                label='Language'
                margin='normal'
                onChange={setValue('language')}
                value={info.language || ''}
            />
            <TextField
                variant="outlined"
                fullWidth
                label='Translator'
                margin='normal'
                onChange={setValue('translator')}
                value={info.translator || ''}
            />
            <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                fullWidth
            >
                ADD NEW EDITION
            </Button>
            {errored && <div style={{color: 'red', marginTop: 5, textAlign: 'center', fontWeight: 'bold'}}>
                {errorMessage}</div>}
        </div>
    )
}
