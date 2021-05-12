import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, LinearProgress, Grid, Typography, Select, MenuItem } from '@material-ui/core';
import Login from './Login';
import Signup from './Signup';
import CustomLink from '../StyledComponents/CustomLink';
import UserImage from '../../assets/user.jpg';
import AuthorImage from '../../assets/author.jpg';
import LibrarianImage from '../../assets/admin.jpg';
import Alert from '@material-ui/lab/Alert';


const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
    },
    bottom: {
        marginTop: '10px'
    },
    submit: {
        margin: theme.spacing(3,0,2),
    },
    error: {
        margin: theme.spacing(2,0,2),
        boxSizing: 'border-box',
        width: '100%'
    },
    loading: {
        margin: theme.spacing(2,0,2),
        height: '10px',
        boxSizing: 'border-box',
        width: '100%'
    }
}));

export function LoginSignupContainer() {
    const classes = useStyles();
    const [state, setState] = useState({
        userType: 'USER',
        isLogin: true
    });
    const [error, setError] = useState({
        isError: false,
        errorText: ''
    });
    const [loading, setLoading] = useState(false);

    const switchUserType = e => {
        console.log(e);
        setState({
            ...state,
            userType: e.target.value
        });
    }

    const switchMode = () => {
        setError({
            isError: false,
            errorText: ''
        });

        setState({
            ...state,
            isLogin: !state.isLogin,
        });
    }

    const onError = (errorText) => {
        setError({
            isError: true,
            errorText
        });
        setLoading(false);
        setTimeout(() => {
            setError({
                isError: false,
                errorText
            });
        }, 4000)
    }

    const onSubmit = () => {
        setLoading(true);
    }

    const MainComponent = state.isLogin ? Login : Signup;
    const headerText = (state.isLogin ? 'Sign in' : 'Sign up') + ' as ' + state.userType.toLowerCase();
    const switchText = state.isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign in";

    let loginImage;
    switch(state.userType) {
        case 'USER':
            loginImage = UserImage;
            break;
        case 'AUTHOR':
            loginImage = AuthorImage;
            break;
        case 'LIBRARIAN':
            loginImage = LibrarianImage;
            break;
        default:
            break;
    }

    return (
        <Grid container component="main" className={classes.root}>
            <Grid item xs={false} sm={4} md={7} className={classes.image} 
                  style={{backgroundImage: `url(${loginImage})`}}/>
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6}>
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            {headerText}
                        </Typography>
                        <MainComponent classes={classes} onError={onError} onSubmit={onSubmit} userType={state.userType}/>
                        <Grid container className={classes.bottom}>
                            <Grid item xs>
                                <Select
                                    value={state.userType}
                                    onChange={switchUserType}
                                >
                                    <MenuItem value='USER'>User</MenuItem>
                                    <MenuItem value='AUTHOR'>Author</MenuItem>
                                    <MenuItem value='LIBRARIAN'>Librarian</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item>
                                <CustomLink onClick={switchMode} variant="body2" color="primary">
                                   {switchText}
                                </CustomLink>
                            </Grid>
                        </Grid>
                        {loading && <LinearProgress className={classes.loading} />}
                        {error.isError && <Alert severity="error" className={classes.error}>{error.errorText}</Alert>}
                    </div>
                </Grid>
        </Grid>
    );
}
