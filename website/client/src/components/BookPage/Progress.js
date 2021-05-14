import { Button, Card, Slider, TextField, Typography, withStyles } from '@material-ui/core'
import React, { useState } from 'react'
import { convertToSQLDate, parseDate, isBefore } from '../../utils';
import { useDispatch } from 'react-redux';
import { ADD_PROGRESS } from '../../actions';
import { useUserSelector } from '../../selectors'

const CustomSlider = withStyles({
    root: {
        color: '#52af77',
    },
    track: {
        width: '10px !important',
        borderRadius: 5,
        backgroundColor: '#ccc !important'
    },
    rail: {
        width: '10px !important',
        borderRadius: 5,
    },
    markLabel: {
        marginLeft: '5px',
        marginBottom: '5px',
        fontSize: '20px',
        fontWeight: 'bold'
    },
    markActive: {
        marginTop: '10px',
        width: '10px',
        height: '10px',
        borderRadius: '100%',
        backgroundColor: 'black'
    },
    thumb: {
        display: 'none'
    }
})(Slider);
export default function Progress({trackInformation}) {
    const lastProgress = trackInformation.progresses[trackInformation.progresses.length - 1] || { pageNumber: 0, date: '1970-01-01'};
    let marks, isFinished;
    if (lastProgress.pageNumber < trackInformation.edition.pageCount) {
        marks = trackInformation.progresses.map(e => {
            return {
                value: -e.pageNumber,
                label: `Page ${e.pageNumber} in ${parseDate(e.date)}`
            }
        }).concat([{
            value: -trackInformation.edition.pageCount,
            label: `End of book (${trackInformation.edition.pageCount} page)`
        }]);
    } else {
        marks = trackInformation.progresses.map(e => {
            return {
                value: -e.pageNumber,
                label: `Page ${e.pageNumber} in ${parseDate(e.date)}`
            }
        });
        isFinished = true;
    }

    const dispatch = useDispatch();
    const user = useUserSelector();

    const [pageNumber, setPageNumber] = useState(0);
    const [date, setDate] = useState(convertToSQLDate(Date.now()));

    const handleProgressAddition = () => {
        const page = pageNumber || 0;
        console.log(page)
        if (page > lastProgress.pageNumber && page <= trackInformation.edition.pageCount) {
            setPageNumberErrored(false);
        } else {
            setPageNumberErrored(true);
            return;
        }

        if (isBefore(date, lastProgress.date)) {
            setDateErrored(true);
            return;
        } else {
            setDateErrored(false);
        }

        dispatch({
            type: ADD_PROGRESS,
            payload: {
                pageNumber, 
                date,
                username: user.username,
                ...trackInformation.edition
            }
        });
    }

    const [pageNumberErrored, setPageNumberErrored] = useState(false);
    const [dateErrored, setDateErrored] = useState(false);



    return (
        <div
            style={{
                width: 500,
                height: '100%',
                boxShadow: '2px 0 20px 2px #888',
                padding: "20px",
                boxSizing: 'border-box'
            }}
        >
            <Typography variant="h4" style={{marginBottom: '20px'}}><b>Your Progress</b></Typography>
            <CustomSlider
                scale={x => -x}
                track='inverted'
                orientation='vertical'
                min={-trackInformation.edition.pageCount}
                max={0}
                value={-lastProgress.pageNumber}
                marks={marks}
                step={null}
                valueLabelDisplay='auto'
                style={{height: '400px'}}
            />
            <Card  
                style={{
                    marginTop: '20px', 
                    padding: 10, 
                    backgroundColor: '#eee',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '134px'
                }}
            >
                {isFinished ? 
                    <Typography variant="h4" align="center">You finished reading this book. Congratulations!</Typography>
                    :
                    <>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <TextField
                                type="number"
                                error={pageNumberErrored}
                                helperText={pageNumberErrored && `Enter number between ${lastProgress.pageNumber} and ${trackInformation.edition.pageCount}`}
                                label="Page Number"
                                variant="outlined"
                                value={pageNumber}
                                style={{flex: 1, margin: '10px 0'}}
                                onChange={e => setPageNumber(parseInt(e.target.value))}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <div style={{flex: 0.2}}></div>
                            <TextField
                                label="Date"
                                type="date"
                                error={dateErrored}
                                helperText={dateErrored && 'Enter date after the last progress'}
                                variant='outlined'
                                value={date}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={e => setDate(e.target.value)}
                                style={{flex: 1, margin: '10px 0'}}
                            />
                        </div>
                        <Button variant="contained" color="primary" onClick={handleProgressAddition}>Add New Progress</Button>
                    </>
                }
            </Card>
        </div>
    )
}
