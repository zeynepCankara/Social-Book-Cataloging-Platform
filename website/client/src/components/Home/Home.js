import React from 'react';
import { useDispatch } from 'react-redux';
import { AppBar, Toolbar, makeStyles, styled, Button, Container, Typography } from '@material-ui/core';
import { SET_HOME_CONTENT } from '../../actions';
import HomePage from '../HomePage/HomePage';
import BookListContainer from '../BookList/BookListContainer';
import ChallengeListContainer from '../ChallengeList/ChallengeListContainer';
import BooksContainer from '../Books/BooksContainer';
import Logo from '../../assets/logo.png';
import { useHomeContentSelector, useUserSelector } from '../../selectors';
import BookPage from '../BookPage/BookPage';
import UserMenu from './UserMenu';
import MyBooks from '../MyBooks/MyBooks';

const useStyles = makeStyles((theme) => ({
    navBar: {
        backgroundColor: '#F4F1EA',
        boxSizing: 'border-box',
        minHeight: '50px',
        padding: '0'
    },
    logo: {
        width: '200px',
        height: '50px',
        backgroundImage: `url(${Logo})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    }
}));

const NavButton = styled(Button)({
    display: 'flex',
    alignItems: 'center',
    height: '50px',
    padding: '0 20px',
    color: '#382110',
    fontSize: '20px',
    fontWeight: '500',
    textTransform: 'none',
    borderRadius: '0',
    cursor: 'pointer',
    '&:hover': {
        color: 'white',
        backgroundColor: '#382110'
    }
})

export default function Home() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const user = useUserSelector();
    const homeContent = useHomeContentSelector();

    const setHomeContent = mode => () => {
        dispatch({
            type: SET_HOME_CONTENT,
            payload: { mode }
        })
    }

    let MainComponent = Container;
    switch (homeContent.mode) {
        case 'home':
            MainComponent = HomePage;
            break;
        case 'books':
            MainComponent = BooksContainer;
            break;
        case 'challenges':
            MainComponent = ChallengeListContainer;
            break;
        case 'booklists':
            MainComponent = BookListContainer;
            break;
        case 'book':
            MainComponent = BookPage;
            break;
        case 'mybooks':
            MainComponent = MyBooks;
            break;
        default:
            MainComponent = Container;
    }

    const renderButton = (mode, text, disabled) => {
        return (<NavButton
            onClick={disabled ? (e => e) : setHomeContent(mode)}
            style={homeContent && (homeContent.mode === mode || disabled ? {
                backgroundColor: '#382110',
                color: 'white'
            } : {})}
        >
            {text}
        </NavButton>)
    }
    return (
        <div>
            <AppBar position="sticky">
                <Toolbar className={classes.navBar}>
                    <div className={classes.logo}/>
                    {renderButton('home', 'Home')}
                    {renderButton('books', 'Books')}
                    {renderButton('challenges', 'Challenges')}
                    {renderButton('booklists', 'My Lists')}
                    {homeContent.mode === 'mybooks' && renderButton('mybooks', 'My Books', true)}
                    {homeContent.mode === 'book' && renderButton('books', homeContent.book.name, true)}
                    <div style={{flex: 1}}/>
                    <UserMenu/>
                </Toolbar>
            </AppBar>
            <MainComponent {...homeContent}/>
        </div>
    )
}
