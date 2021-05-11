import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { LoginSignupContainer } from './components/LoginSignup/LoginSignupContainer';
import Home from './components/Home/Home';
import CookieProvider from './CookieProvider';

function App() {
    return (
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
    );
}

export default App;
