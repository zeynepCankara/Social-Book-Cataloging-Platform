import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { LOGIN_REQUEST } from '../../actions';

export default function Login({classes, onError: parentError, onSubmit, isAdmin}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [state, setState] = useState({
        name: '',
        password: '',
    });
    const [errored, setErrored] = useState({
        name: false,
        password: false
    })

    const handleNameInput = e => {
        setState({
            ...state,
            name: e.target.value,
        })

        setErrored({
            ...errored,
            name: false
        })
    }

    const handlePasswordInput = e => {
        setState({
            ...state,
            password: e.target.value,
        })

        setErrored({
            ...errored,
            password: false
        })
    }

    const onError = errorText => {
        parentError(errorText);
        setState({
            name: '',
            password: ''
        })
    }

    const handleLogin = () => {
        if (state.name === '') {
            parentError('Please fill the name field');
            setErrored({
                ...errored,
                name: true
            })
        } else if (state.password === '') {
            parentError('Please enter password');
            setErrored({
                ...errored,
                password: true
            })
        } else {
            onSubmit();
            dispatch({
                type: LOGIN_REQUEST,
                payload: {
                    ...state,
                    isAdmin
                },
                history,
                onError
            })
        }
    }

    return (
        <>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                onChange={handleNameInput}
                value={state.name}
                error={errored.name}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handlePasswordInput}
                value={state.password}
                error={errored.password}
            />
            <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleLogin}
            >
                Sign In
            </Button>
        </>
    )
}