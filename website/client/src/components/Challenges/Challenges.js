import React from 'react'
import { makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
import { useChallengesSelector } from '../../selectors';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        height: 'calc(100vh - 50px)'
    }
}))

export default function Challenges() {
    const classes = useStyles();

    const challenges = useChallengesSelector();

    return (
        <div className={classes.container}>
            <div style={{flex: 1, boxShadow: '2px 0 20px 2px #888'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Book Count</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {challenges.map(e => {
                            return <TableRow>
                                <TableCell>{e.name}</TableCell>
                                <TableCell>{e.startDate}</TableCell>
                                <TableCell>{e.endDate}</TableCell>
                                <TableCell>{e.description}</TableCell>
                                <TableCell>{e.type}</TableCell>
                                <TableCell>{e.bookCount}</TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </div>
            <div style={{width: 600}}>

            </div>
        </div>
    )
}
