import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, LinearProgress, Grid, Typography} from '@material-ui/core';
import Login from './Login';
import Signup from './Signup';
import CustomLink from '../StyledComponents/CustomLink';
import AdminImage from '../../assets/admin.jpg';
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
        backgroundColor: theme.palette.secondary.main,
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
        isAdmin: false,
        isLogin: true
    });
    const [error, setError] = useState({
        isError: false,
        errorText: 'adada'
    });
    const [loading, setLoading] = useState(false);

    const switchAdminMode = () => {
        setState({
            ...state,
            isAdmin: !state.isAdmin
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
    const headerText = state.isLogin ? (state.isAdmin ? 'Sign In as Admin' : 'Sign In') : 'Sign Up';
    const switchText = state.isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign in";

    return (
        <Grid container component="main" className={classes.root}>
            <Grid item xs={false} sm={4} md={7} className={classes.image} 
                  style={{backgroundImage: state.isAdmin ? `url(${AdminImage})` : 'url(https://source.unsplash.com/random)'}}/>
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6}>
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            {headerText}
                        </Typography>
                        <MainComponent classes={classes} onError={onError} onSubmit={onSubmit} isAdmin={state.isAdmin}/>
                        <Grid container className={classes.bottom}>
                            <Grid item xs>
                                {state.isLogin && 
                                    <CustomLink onClick={switchAdminMode} variant="body2">
                                    {state.isAdmin ? "I'm not Admin" : "I'm Admin"}
                                    </CustomLink>}
                            </Grid>
                            <Grid item>
                                <CustomLink onClick={switchMode} variant="body2">
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
