import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListSubheader, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import { useGroupsSelector, useUserSelector } from '../../selectors';
import { useDispatch } from 'react-redux';
import { CREATE_GROUP, GET_ALL_PARTICIPANTS_OF_GROUP, GET_AVAILABLE_GROUPS, JOIN_GROUP} from '../../actions';

const NewGroupDialog = ({
    open,
    handleClose,
}) => {
    const dispatch = useDispatch();
    const user = useUserSelector();
    const [info, setInfo] = useState({
        title: '',
        description: '',
    });

    const setValue = type => e => {
        setInfo({
            ...info,
            [type]: e.target.value
        })

    }

    const handleSubmit = () => {
        dispatch({
            type: CREATE_GROUP,
            payload: {
                name: info.title,
                description: info.description,
                username: user.username
            }
        });
        handleClose();
    }

    return (
        <Dialog open={open} onClose={() => {
            setInfo({
                title: '',
                description: '',
            });
            handleClose();
        }}>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogContent>
                <TextField
                    variant="outlined"
                    fullWidth
                    label='Title'
                    margin='normal'
                    onChange={setValue('title')}
                    value={info.title || ''}
                />
                <TextField
                    multiline
                    variant="outlined"
                    fullWidth
                    label='Description'
                    margin='normal'
                    onChange={setValue('description')}
                    value={info.description || ''}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={handleSubmit}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>)
}

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        height: 'calc(100vh - 50px)'
    }
}))

export default function Groups() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [participants, setParticipants] = useState([]);
    const user = useUserSelector();
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [newGroupIsOpen, toggleNewGroupPopup] = useState(false);

    useEffect(() => {
        dispatch({
            type: GET_AVAILABLE_GROUPS
        })
    }, [])

    const groups = useGroupsSelector();


    const showParticipants = group => () => {
        dispatch({
            type: GET_ALL_PARTICIPANTS_OF_GROUP,
            payload: {
                group,
                onSuccess: setParticipants
            }
        })
    }

    const joinedGroup = group => () => {
        setJoinedGroups([...joinedGroups, group.groupId])
    }

    const joinGroup = group => e => {
        e.stopPropagation();

        dispatch({
            type: JOIN_GROUP,
            payload: {
                data: {
                    ...group,
                    username: user.username
                },
                onSuccess: joinedGroup(group)
            }
        })
    }

    return (
        <div className={classes.container}>
            <div style={{flex: 1, boxShadow: '2px 0 20px 2px #888', padding: 20, overflowY: 'auto'}}>
                <Table>
                    <TableHead>
                        {user.userType === 'USER' && <TableRow colSpan={7}>
                            <Button
                                variant='contained'
                                color='secondary'
                                fullWidth
                                onClick={() => toggleNewGroupPopup(true)}
                            >ADD NEW GROUP</Button>
                        </TableRow>}
                        <TableRow>
                            <TableCell align="center" style={{fontWeight: 'bold', fontSize: 20}}>Name</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold', fontSize: 20}}>Description</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold', fontSize: 20}}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groups.map(e => {
                            return <TableRow
                                hover
                                onClick={showParticipants(e)}
                                style={{cursor: 'pointer'}}
                            >
                                <TableCell align="center">{e.name}</TableCell>
                                <TableCell align="center">{e.description}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        onClick={joinGroup(e)}
                                        disabled={joinedGroups.includes(e.groupId)}
                                    >
                                        JOIN
                                    </Button>
                                </TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </div>
            <div style={{width: 400, maxWidth: 400, padding: 20, overflowY: 'auto'}}>
               { participants.length !== 0 ?
               <Table
                    subheader={
                        <Typography variant="h5" align="center">
                            Participants
                        </Typography>
                    }
                >
                    <TableHead>
                        <Typography variant="h5" align="center">
                            Participants
                        </Typography>
                        <TableRow>
                            <TableCell align="center">Participant Name</TableCell>
                            <TableCell align="center">Currently Read Book Count</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {participants.map(e => {
                            return <TableRow divider>
                                <TableCell align="center">{e.name}</TableCell>
                                <TableCell align="center">{e.score}</TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
                :
                <Typography variant="h6" align="center">Select Group to See Participants</Typography>
                }
            </div>
            <NewGroupDialog
                open={newGroupIsOpen}
                handleClose={() => toggleNewGroupPopup(false)}
            />
        </div>
    )
}
