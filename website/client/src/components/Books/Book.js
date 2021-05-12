import React from 'react'
import { Button, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 30px -5px #ccc',
        backgroundColor: 'white',
        borderRadius: '5px'
    },
    name: {
        fontSize: '25px',
        fontWeight: 'bold',
        fontFamily: '"Merriweather"',
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
        marginRight: '10px',
        flex: 1
    }
}))
export default function Book({info, className}) {
    const classes = useStyles();

    console.log(info);
    return (
        <div className={`${classes.container} ${className || ''}`}>
                <Typography className={classes.name}>{info.name}</Typography>
                <Typography className={classes.author}>{`by ${info.author_name}`}</Typography>
                <div className={classes.actions}>
                    <Button className={classes.actionButton} variant='contained' color="primary">Start Reading</Button>
                    <Button className={classes.actionButton} variant='contained' color="primary">Review</Button>
                </div>
        </div>
    )
}
