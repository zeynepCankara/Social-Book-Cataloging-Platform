import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { Avatar, List, ListItem, withStyles } from '@material-ui/core';
import Cookies from 'universal-cookie';
import { useUserSelector } from '../../selectors';
import { useDispatch } from 'react-redux';
import { SET_HOME_CONTENT } from '../../actions';

const useStyles = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(2),
    },
    container: {
        marginRight: '10px'
    },
    accountBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        color: '#706E6B',
        fontSize: '20px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    accountType: {
        margin: 10,
        fontSize: 14,
        color: 'white',
        backgroundColor: theme.palette.primary.main,
        borderRadius: 5,
        padding: 3
    },
    username: {
        color: theme.palette.primary.main
    },
    avatar: {
        fontSize: '25px',
        margin: '0 10px',
        backgroundColor: theme.palette.primary.main
    }
}));

const MyListItem = withStyles({
    root: {
        fontSize: '20px',
        display: 'flex',
        justifyContent: 'center',
        fontWeight: 'bold',
    }
})(ListItem);

export default function UserMenu() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const user = useUserSelector();
    const dispatch = useDispatch();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleLogout = () => {
        const cookies = new Cookies();
        cookies.remove('username');
        window.location.reload();
    }

    const openMyBooks = () => {
        dispatch({
            type: SET_HOME_CONTENT,
            payload: { mode: 'mybooks' }
        })
        handleClose();
    }

    const openProfile = () => {
        dispatch({
            type: SET_HOME_CONTENT,
            payload: { mode: 'profile' }
        })
        handleClose();
    }

    return (
        <div className={classes.container}>
            <div className={classes.accountBox} onClick={handleClick}>
                <div className={classes.accountType}>
                    {user.userType}
                </div>
                <Typography className={classes.username} style={{ fontSize: '25px', fontWeight: 'bold'}}>{user?.username}</Typography>
                <Avatar className={classes.avatar} fontSize="large">{user?.username?.substring(0,1)}</Avatar>
            </div>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
                }}
                transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
                }}
            >
                <List style={{width: 200}}>
                    {user.userType === 'AUTHOR' && <MyListItem button divider onClick={openMyBooks}>
                        My Books
                    </MyListItem>}
                    <MyListItem button divider onClick={openProfile}>
                        My Profile
                    </MyListItem>
                    <MyListItem button onClick={handleLogout} divider>
                        Logout
                    </MyListItem>
                </List>
            </Popover>
        </div>
    );
}