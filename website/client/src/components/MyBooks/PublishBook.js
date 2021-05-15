import { Button, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { PUBLISH_BOOK } from '../../actions';
import { useUserSelector } from '../../selectors';

export default function PublishBook() {
    const dispatch = useDispatch();
    const user = useUserSelector();
    const [info, setInfo] = useState({
        title: '',
        genre: '',
        year: new Date().getFullYear()
    });

    const setValue = type => e => {
        setInfo({
            ...info,
            [type]: e.target.value
        })
        
    }

    const handleSubmit = () => {
        if (info.title !== '' && info.genre !== '') {
            dispatch({
                type: PUBLISH_BOOK,
                payload: {
                    name: info.title,
                    genre: info.genre,
                    year: info.year,
                    authorName: user.username
                }
            })
        }
    }
    return (
        <div style={{padding: 10}}>
            <TextField
                type='number'
                variant="outlined"
                fullWidth
                label='Book Title'
                margin='normal'
                onChange={setValue('title')}
                value={info.title}
            />
            <TextField
                variant="outlined"
                fullWidth
                label='Genre'
                margin='normal'
                onChange={setValue('genre')}
                value={info.genre}
            />
            <TextField
                variant="outlined"
                fullWidth
                label='Publish Year'
                margin='normal'
                onChange={setValue('year')}
                value={info.year}
            />
            <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                fullWidth
            >
                PUBLISH
            </Button>
        </div>
    )
}
