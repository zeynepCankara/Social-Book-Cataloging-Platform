import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListSubheader, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@material-ui/core'
import { useChallengesSelector, useUserSelector } from '../../selectors';
import { useDispatch } from 'react-redux';
import { CREATE_CHALLENGE, GET_ALL_PARTICIPANTS_OF_CHALLENGE, GET_AVAILABLE_CHALLENGES, JOIN_CHALLENGE } from '../../actions';
import { parseDate } from '../../utils';

const NewChallengeDialog = ({
    open,
    handleClose,
}) => {
    const dispatch = useDispatch();
    const user = useUserSelector();
    const [info, setInfo] = useState({
        title: '',
        startDate: '',
        endDate: '',
        description: '',
        type: '',
        bookCount: ''
    });

    const setValue = type => e => {
        setInfo({
            ...info,
            [type]: e.target.value
        })
        
    }

    const handleSubmit = () => {
        dispatch({
            type: CREATE_CHALLENGE,
            payload: {
                name: info.title, 
                startDate: info.startDate, 
                endDate: info.endDate, 
                description: info.description, 
                type: info.type, 
                bookCount: info.bookCount, 
                username: user.username
            }
        });
        handleClose();
    }

    return (
        <Dialog open={open} onClose={() => {
            setInfo({
                title: '',
                startDate: '',
                endDate: '',
                description: '',
                type: '',
                bookCount: ''
            });
            handleClose();
        }}>
            <DialogTitle>Create New Challenge</DialogTitle>
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
                    type='date'
                    variant="outlined"
                    fullWidth
                    label='Start Date'
                    margin='normal'
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={setValue('startDate')}
                    value={info.startDate || ''}
                />
                <TextField
                    type='date'
                    variant="outlined"
                    fullWidth
                    label='End Date'
                    margin='normal'
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={setValue('endDate')}
                    value={info.endDate || ''}
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
                <TextField
                    variant="outlined"
                    fullWidth
                    label='Type'
                    margin='normal'
                    onChange={setValue('type')}
                    value={info.type || ''}
                />
                <TextField
                    type='number'
                    variant="outlined"
                    fullWidth
                    label='Book Count'
                    margin='normal'
                    onChange={setValue('bookCount')}
                    value={info.bookCount || ''}
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

export default function Challenges() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [participants, setParticipants] = useState([]);
    const user = useUserSelector();
    const [joinedChallenges, setJoinedChallenges] = useState([]);
    const [newChallengeIsOpen, toggleNewChallengePopup] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState(-1);

    useEffect(() => {
        dispatch({
            type: GET_AVAILABLE_CHALLENGES
        })
    }, [])

    const challenges = useChallengesSelector();


    const showParticipants = challenge => () => {
        dispatch({
            type: GET_ALL_PARTICIPANTS_OF_CHALLENGE,
            payload: {
                challenge,
                onSuccess: setParticipants
            }
        })
        setSelectedChallenge(challenge.challengeId);
    }

    const joinedChallenge = challenge => () => {
        setJoinedChallenges([...joinedChallenges, challenge.challengeId])
    }

    const joinChallenge = challenge => e => {
        e.stopPropagation();
        
        dispatch({
            type: JOIN_CHALLENGE,
            payload: {
                data: {
                    ...challenge,
                    username: user.username
                },
                onSuccess: joinedChallenge(challenge)
            }
        })
    }

    return (
        <div className={classes.container}>
            <div style={{flex: 1, boxShadow: '2px 0 20px 2px #888', padding: 20, overflowY: 'auto'}}>
                <Table>
                    <TableHead>
                        {user.userType === 'LIBRARIAN' && <TableRow colSpan={7}>
                            <Button
                                variant='contained'
                                color='secondary'
                                fullWidth
                                onClick={() => toggleNewChallengePopup(true)}
                            >ADD NEW CHALLENGE</Button>
                        </TableRow>}
                        <TableRow>
                            <TableCell align="center" style={{fontWeight: 'bold', fontSize: 20}}>Title</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold', fontSize: 20}}>Start Date</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold', fontSize: 20}}>End Date</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold', fontSize: 20}}>Description</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold', fontSize: 20}}>Type</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold', fontSize: 20}}>Book Count</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold', fontSize: 20}}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {challenges.map(e => {
                            return <TableRow
                                hover
                                onClick={showParticipants(e)}
                                style={{cursor: 'pointer', backgroundColor: selectedChallenge === e.challengeId && '#ddd'}}
                            >
                                <TableCell align="center">{e.name}</TableCell>
                                <TableCell align="center">{parseDate(e.startDate)}</TableCell>
                                <TableCell align="center">{parseDate(e.endDate)}</TableCell>
                                <TableCell align="center">{e.description}</TableCell>
                                <TableCell align="center">{e.type}</TableCell>
                                <TableCell align="center">{e.bookCount}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        onClick={joinChallenge(e)}
                                        disabled={joinedChallenges.includes(e.challengeId)}
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
                <Typography variant="h6" align="center">Select Challenge to See Participants</Typography>
                }
            </div>
            <NewChallengeDialog
                open={newChallengeIsOpen}
                handleClose={() => toggleNewChallengePopup(false)}
            />
        </div>
    )
}
