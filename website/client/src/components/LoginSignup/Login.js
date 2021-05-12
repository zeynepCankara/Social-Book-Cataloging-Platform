import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { LOGIN_REQUEST } from '../../actions';

export default function Login({classes, onError: parentError, onSubmit, userType}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [state, setState] = useState({
        username: '',
        password: '',
    });
    const [errored, setErrored] = useState({
        username: false,
        password: false
    })

    const handleNameInput = e => {
        setState({
            ...state,
            username: e.target.value,
        })

        setErrored({
            ...errored,
            username: false
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
            username: '',
            password: ''
        })
    }

    const handleLogin = () => {
        if (state.username === '') {
            parentError('Please fill the username field');
            setErrored({
                ...errored,
                username: true
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
                    userType
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
                id="username"
                label="Name"
                username="username"
                autoComplete="username"
                autoFocus
                onChange={handleNameInput}
                value={state.username}
                error={errored.username}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                username="password"
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