import React, { useState } from 'react';
import { Button, makeStyles, Slider, TextField, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { APPLY_FILTERS, FETCH_BOOKS_REQUEST } from '../../actions';

const useStyles = makeStyles((theme) => ({
    container: {
        flexBasis: '25%',
        margin: '40px',
    },
    publishYear: {
        color: 'rgba(0, 0, 0, 0.54)',
        margin: '32px 0 8px 0'
    },
    reset: {
        cursor: 'pointer',
        color: 'rgba(0, 0, 0, 0.54)',
        '&:hover': {
            textDecoration: 'underline'
        },
        marginBottom: '30px'
    },
    slider: {
        margin: '0 10px',
        width: 'calc(100% - 20px)',
        paddingBottom: '0'
    },
    button: {
        marginTop: '10px',
        fontWeight: 'bold',
    },
    publishInfo: {
        display: 'flex',
        justifyContent: 'space-between'
    }
}))

export default function Filter() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [filter, setFilter] = useState({});

    const changeFilter = filterType => (event, range) => {
        if (filterType === 'publishYear') {
            setFilter({
                ...filter,
                publishYear: range
            })
        } else {
            if (event.target.value === '') {
                let newState = {...filter};
                delete newState[filterType];
                setFilter(newState);
            } else {
                setFilter({
                    ...filter,
                    [filterType]: event.target.value
                })
            }
        }
    }

    const resetFilter = filterType => e => {
        if (filterType) {
            let newState = {...filter};
            delete newState[filterType];
            setFilter(newState);
        } else {
            setFilter({});
            dispatch({
                type: FETCH_BOOKS_REQUEST,
                onSuccess: () => {},
                onFailure: () => {}
            })
        }
    }

    const applyFilter = () => {
        if (Object.keys(filter).length !== 0) {
            dispatch({
                type: APPLY_FILTERS,
                payload: filter
            })
        } else {
            dispatch({
                type: FETCH_BOOKS_REQUEST,
                onSuccess: () => {},
                onFailure: () => {}
            })
        }
    }

    return (
        <div className={classes.container}>
            <TextField
                margin="normal"
                fullWidth
                id="bookName"
                label="Book Name"
                onChange={changeFilter('bookName')}
                value={filter.bookName || ''}
            />
            <TextField
                margin="normal"
                fullWidth
                id="author"
                label="Author"
                onChange={changeFilter('author')}
                value={filter.author || ''}
            />
            <TextField
                margin="normal"
                fullWidth
                id="genre"
                label="Genre"
                onChange={changeFilter('genre')}
                value={filter.genre || ''}
            />
            <Typography
                id='publishYear'
                className={classes.publishYear}
                align='center'
            >
                Publish Year
            </Typography>
            <Slider
                className={classes.slider}
                max={2021}
                min={1900}
                aria-labelledby="publishYear"
                value={filter.publishYear || [1900, 2021]}
                valueLabelDisplay='auto'
                onChange={changeFilter('publishYear')}
            />
            <div className={classes.publishInfo}>
                <Typography
                    style={{color: 'rgba(0, 0, 0, 0.54)'}}
                >
                    {(filter.publishYear && filter.publishYear[0]) || 1900}
                </Typography>
                <Typography 
                    className={classes.reset} 
                    onClick={resetFilter('publishYear')}
                    align='center'    
                >
                    reset
                </Typography>
                <Typography
                    style={{color: 'rgba(0, 0, 0, 0.54)'}}
                >
                    {(filter.publishYear && filter.publishYear[1]) || 2021}
                </Typography>
            </div>
            <Button
                variant='contained'
                color='primary'
                fullWidth
                className={classes.button}
                onClick={applyFilter}
            >
                Apply Filter
            </Button>
            <Button
                variant='contained'
                color='secondary'
                fullWidth
                className={classes.button}
                onClick={resetFilter()}
            >
                Reset Filters
            </Button>
        </div>
    )
}
