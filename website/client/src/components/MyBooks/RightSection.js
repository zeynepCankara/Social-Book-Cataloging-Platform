import React, { useEffect, useState } from 'react'
import { Container, IconButton, List, makeStyles, Typography } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import Review from '../Review/Review';
import NewEdition from './NewEdition';
import PublishBook from './PublishBook';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: 10,
        overflowY: 'auto'
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
            setFlex(0.5);
        }
    }, [content]);

    let MainComponent;
    const setMainComponent = ui => {
        let Header;
        switch (content.mode) {
            case 'listReview':
                Header = <Typography variant="h6">
                    Reviews for <b>{content?.bookInfo?.name}</b>
                </Typography>
                break;
            case 'addEdition':
                Header = <Typography variant="h6">
                    Add Edition for <b>{content?.bookInfo?.name}</b>
                </Typography>
                break;
            case 'publishBook':
                Header = <Typography variant="h6">
                    Publish New Book
                </Typography>
                break; 
            default:
                break;
        }
        MainComponent = ({style}) => {
            return <List
                style={style}
                className={classes.container}
                subheader={                    
                <div className={classes.header}>
                    <IconButton onClick={() => setFlex(0)}>
                        <CancelIcon/>
                    </IconButton>
                    {Header}
                </div>
                }
            >
                    {ui}
            </List>
        }
    }
    switch (content.mode) {
        case 'listReview':
            setMainComponent(content.reviews.map(review => {
                return <div>
                    <div style={{padding: 5}}/>
                    <Review username={review.userName} bookInfo={content.bookInfo} {...review} authorView/>
                </div>
            }));
            break;
        case 'addEdition':
            setMainComponent(<NewEdition bookInfo={content.bookInfo}/>)
            break;
        case 'publishBook':
            setMainComponent(<PublishBook/>)
            break;
        default:
            MainComponent = Container;
    }

    return (
        <MainComponent className={classes.container} style={{flex, display: !flex && 'none'}}/>
    )
}
