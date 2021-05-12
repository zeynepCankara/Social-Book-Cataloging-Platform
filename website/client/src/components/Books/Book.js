import React from 'react'
import { Button, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
        height: '150px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 30px -5px #ccc',
        backgroundColor: 'white',
        borderRadius: '5px',
        boxSizing: 'border-box'
    },
    name: {
        fontSize: '25px',
        fontWeight: 'bold',
        '&:hover': {
            cursor: 'pointer',
            textDecoration: 'underline'
        }
    },
    actions: {
        marginTop: '10px',
        display: 'flex',
        justifyContent: 'space-between'
    },
    actionButton: {
        width: '48%'
    }
}))
export default function Book({info, className}) {
    const classes = useStyles();

    return (
        <div className={`${classes.container} ${className || ''}`}>
                <Typography className={classes.name}>{info.name }</Typography>
                <Typography className={classes.author}>{`by ${info.authorName} (${info.year})`}</Typography>
                <div style={{flex: 1}}/>
                <div className={classes.actions}>
                    <Button className={classes.actionButton} variant='contained' color="secondary">Start Reading</Button>
                    <Button className={classes.actionButton} variant='contained' color="secondary">Review</Button>
                </div>
        </div>
    )
}
