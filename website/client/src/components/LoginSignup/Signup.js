import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SIGNUP_REQUEST } from '../../actions';

export default function Login({classes, onError: parentError, onSubmit, userType}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [state, setState] = useState({
        name: '',
        username: '',
        password: '',
        email: ''
    });
    const [errored, setErrored] = useState({
        name: false,
        username: false,
        password: false,
        email: false
    })

    const handleInput = inputType => e => {
        setState({
            ...state,
            [inputType]: e.target.value,
        })

        setErrored({
            ...errored,
            [inputType]: false
        })
    }

    const onError = errorText => {
        parentError(errorText);
        setState({
            name: '',
            email: '',
            password: ''
        })
    }

    const handleSignup = () => {
        if (state.name === '') {
            parentError('Please fill the name field');
            setErrored({
                ...errored,
                name: true
            })
        } else if (state.username === '') {
            parentError('Please fill the username field');
            setErrored({
                ...errored,
                username: true
            })
        } else if (state.email === '') {
            parentError('Please enter password');
            setErrored({
                ...errored,
                email: true
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
                type: SIGNUP_REQUEST,
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
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                onChange={handleInput('name')}
                value={state.name}
                error={errored.name}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="name"
                autoFocus
                onChange={handleInput('username')}
                value={state.username}
                error={errored.username}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleInput('email')}
                value={state.email}
                error={errored.email}
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
                onChange={handleInput('password')}
                value={state.password}
                error={errored.password}
            />
            <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSignup}
            >
                Sign Up
            </Button>
        </>
    )
}