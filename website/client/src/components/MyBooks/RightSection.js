import React, { useEffect, useState } from 'react'
import { Container, IconButton, List, makeStyles, Typography } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import Review from '../Review/Review';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: 10,
        overflowY: 'scroll'
    },
    header: {
        padding: '10px 0',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #ccc',
    }
}))

export default function RightSection({content}) {
    const classes = useStyles();
    const [flex, setFlex] = useState(0);

    useEffect(() => {
        if (content) {
            switch (content.mode) {
                case 'listReview':
                    break;
            
                default:
                    break;
            }
            setFlex(0.5);
        }
    }, [content]);

    let MainComponent;
    switch (content.mode) {
        case 'listReview':
            MainComponent = ({style}) => {
                return <List
                    style={style}
                    className={classes.container}
                    subheader={                    
                    <div className={classes.header}>
                        <IconButton onClick={() => setFlex(0)}>
                            <CancelIcon/>
                        </IconButton>
                        <Typography variant="h6">Reviews for <b>{content?.bookInfo?.name}</b></Typography>
                    </div>
                    }
                >
                        {content.reviews.map(review => {
                            return <div>
                                <div style={{padding: 5}}/>
                                <Review username={review.userName} bookInfo={content.bookInfo} {...review} authorView/>
                            </div>
                        })}
                </List>
            }
            break;
        default:
            MainComponent = Container;
    }

    return (
        <MainComponent className={classes.container} style={{flex, display: !flex && 'none'}}/>
    )
}
