import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { LoginSignupContainer } from './components/LoginSignup/LoginSignupContainer';
import Home from './components/Home/Home';

function App() {
    return (
        <Router>
            <Switch>
                <Route path='/home'>
                    <Home/>
                </Route>
                <Route path='/'>
                    <LoginSignupContainer/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
