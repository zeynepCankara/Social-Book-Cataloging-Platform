import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { LoginSignupContainer } from './components/LoginSignup/LoginSignupContainer';
import BookListContainer from './components/BookList/BookListContainer';
import ChallengeListContainer from './components/ChallengeList/ChallengeListContainer';
import Home from './components/Home/Home';
import CookieProvider from './CookieProvider';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

// <LoginSignupContainer/>
// <BookListContainer/>
// <ChallengeListContainer/>

const THEME = createMuiTheme({
    typography: {
        fontFamily: [
            '"Merriweather"'
        ].join(','),
    },
    palette: {
        primary: {
            main: '#382110',
            dark: '#F4F1EA'
        },
        secondary: {
            main: '#F4F1EA',
            dark: '#382110',
        },
    },
    overrides: {
        MuiButton: {
            textPrimary: {
                color: '#382110'
            },
            containedPrimary: {
                '&:hover': {
                    color: '#382110'
                }
            },
            containedSecondary: {
                '&:hover': {
                    color: 'white'
                }
            },
        }
    }
})

function App() {
    return (
        <ThemeProvider theme={THEME}>
            <Router>
                <CookieProvider>
                    <Switch>
                        <Route path='/home'>
                            <Home/>
                        </Route>
                        <Route path='/'>
                            <LoginSignupContainer/>
                        </Route>
                    </Switch>
                </CookieProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;
