import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
        flex: 0.4,
        boxShadow: '2px 0 20px -2px #888', 
    }
}))

export default function Filter() {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            
        </div>
    )
}
