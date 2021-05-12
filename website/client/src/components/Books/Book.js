import React from 'react'
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
        width: '90%',
        padding: '10px',
        borderBottom: '1px solid grey',
    },
    name: {
        fontSize: '25px',
        fontWeight: 'bold',
        fontFamily: '"Merriweather"',
        '&:hover': {
            cursor: 'pointer',
            textDecoration: 'underline'
        }
    }
}))
export default function Book({info, className}) {
    const classes = useStyles();

    return (
        <div className={`${classes.container} ${className || ''}`}>
            <Typography className={classes.name}>{info.name}</Typography>
            <Typography className={classes.author}>{`by ${info.author_name}`}</Typography>
        </div>
    )
}
