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
        password: '',
        email: ''
    });
    const [errored, setErrored] = useState({
        name: false,
        password: false,
        email: false
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

    const handleEmailInput = e => {
        setState({
            ...state,
            email: e.target.value,
        })

        setErrored({
            ...errored,
            email: false
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
                onChange={handleNameInput}
                value={state.name}
                error={errored.name}
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
                onChange={handleEmailInput}
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
                onClick={handleSignup}
            >
                Sign Up
            </Button>
        </>
    )
}