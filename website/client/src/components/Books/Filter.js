import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
        flex: 0.3,
    }
}))

export default function Filter() {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            
        </div>
    )
}
