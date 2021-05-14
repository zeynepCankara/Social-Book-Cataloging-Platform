import React from 'react'
import { Rating } from '@material-ui/lab';
import { Typography, makeStyles, Card, Avatar } from '@material-ui/core';
import { parseDate } from '../../utils';

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
    date
}) {
    const classes = useStyles();

    return (
        <Card raised className={classes.container}>
            <Avatar style={{
                marginTop: '10px',
                backgroundColor:"#382110",
                width: '50px',
                height: '50px',
                fontSize: '30px'
            }}>{username.substring(0,1)}</Avatar>
            <div style={{marginLeft: '10px'}}>
                <Typography className={classes.header}>
                    <b>{`${username} `}</b>
                    reviewed
                    <b>{` ${bookInfo.name}`}</b>
                </Typography>
                <div style={{display: 'flex', marginBottom: '10px'}}>
                    <Rating size='small' readOnly value={rate} style={{margin: '3px 5px 0 0'}}/>
                    <Typography>{parseDate(date)}</Typography>
                </div>
                <Typography>{comment}</Typography>
            </div>
        </Card>
    )
}
