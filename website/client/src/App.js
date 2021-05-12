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
            '"Lato"', 
            '"Helvetica Neue"', 
            '"Helvetica"', 
            'sans-serif'
        ].join(','),
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
