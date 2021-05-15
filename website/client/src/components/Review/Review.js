import React, { useState } from 'react'
import { Rating } from '@material-ui/lab';
import { Typography, makeStyles, Card, Avatar, TextField } from '@material-ui/core';
import { parseDate, convertToSQLDate } from '../../utils';
import { useReplySelector, useUserSelector } from '../../selectors';
import { useDispatch } from 'react-redux';
import { ADD_REPLY } from '../../actions'; 

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        padding: '20px 40px 20px 20px',
    }, 
    header: {
        fontSize: '22px',
    }
}))

export default function Review({
    username,
    bookInfo,
    rate,
    comment,
    date,
    authorView,
    userId
}) {
    const classes = useStyles();
    const [reply, setReply] = useState('');
    const oldReply = useReplySelector(userId, bookInfo.bookId);
    const user = useUserSelector();
    const dispatch = useDispatch();
    
    const handleReply = () => {
       dispatch({
           type: ADD_REPLY,
           payload: {
               userId,
               bookId: bookInfo.bookId,
               date: convertToSQLDate(Date.now()),
               text: reply,
               authorName: user.username
           }
       }) 
    }

    return (
        <Card raised className={classes.container}>
            <Avatar style={{
                marginTop: '10px',
                backgroundColor:"#382110",
                width: '50px',
                height: '50px',
                fontSize: '30px'
            }}>{username.substring(0,1)}</Avatar>
            <div style={{marginLeft: '10px', width: '100%'}}>
                <Typography className={classes.header}>
                    <b>{`${username} `}</b>
                    reviewed
                    {!authorView && <b>{` ${bookInfo.name}`}</b>}
                </Typography>
                <div style={{display: 'flex', marginBottom: '10px'}}>
                    <Rating size='small' readOnly value={rate} style={{margin: '3px 5px 0 0'}}/>
                    <Typography>{parseDate(date)}</Typography>
                </div>
                <Typography>{comment}</Typography>
                {authorView && (oldReply ? 
                <div style={{marginTop: 10}}>
                    <Typography style={{color: '#bbb'}}>
                        {`replied on ${parseDate(oldReply.date)}`}
                    </Typography>
                    <Typography>
                        {oldReply.text}
                    </Typography>
                </div>
                :
                <TextField
                    margin="dense"
                    multiline
                    rows={2}
                    maxRows={2}
                    fullWidth
                    variant="outlined" 
                    size="small" 
                    placeholder="Reply..."
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {   
                            e.preventDefault();
                            handleReply();
                        }
                    }}
                />)
                }
            </div>
        </Card>
    )
}
