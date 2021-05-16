import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { GET_BOUGHT_BOOKS, GET_CHALLENGE_OUTCOMES } from '../../actions';
import { useUserSelector } from '../../selectors';
import { Avatar, List, ListItem, ListSubheader, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: 30,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 50px)'
    },
    avatar: {
        height: 100,
        width: 100,
        fontSize: 70,
        margin: '0 10px',
        backgroundColor: theme.palette.primary.main
    }
}))

export default function Profile() {
    const classes = useStyles();
    const [challengeOutcomes, setChallengeOutcomes] = useState([]);
    const [boughtBooks, setBoughtBooks] = useState([]);
    const dispatch = useDispatch();
    const user = useUserSelector();

    useEffect(() => {
        dispatch({
            type: GET_BOUGHT_BOOKS,
            payload: {
                data: {
                    username: user.username
                },
                onSuccess: setBoughtBooks
            }
        });
        dispatch({
            type: GET_CHALLENGE_OUTCOMES,
            payload: {
                data: {
                    username: user.username
                },
                onSuccess: setChallengeOutcomes
            }
        });

    }, []);

    return (
        <div className={classes.container}>
            <div style={{display: 'flex', alignItems: 'flex-end'}}>
                <Avatar className={classes.avatar} fontSize="large">{user?.username?.substring(0,1)}</Avatar>
                <Typography variant='h3'><b>{user.username}</b></Typography>
            </div>
            <div style={{display: 'flex', marginTop: 50, flex: 1}}>
                <List
                    style={{borderRight: '1px solid'}}
                    subheader={<ListSubheader><Typography variant='h4' color='primary'>Bought Books</Typography></ListSubheader>}
                >
                    {boughtBooks.map(e => {
                        return <ListItem divider>
                            <Typography variant='h5' align='center'>{e.name}</Typography>
                        </ListItem>
                    })}
                </List>
                <List
                    subheader={<ListSubheader><Typography variant='h4' color='primary'>Challenge Outcomes</Typography></ListSubheader>}
                >
                    {challengeOutcomes.map(e => {
                        return <ListItem divider>
                            <Typography variant='h5' align='center'>{`You ${e.achieved === 1 ? 'won' : 'lose'} ${e.name}`}</Typography>
                        </ListItem>
                    })}
                </List>
            </div>
        </div>
    )
}
