import { render } from '@testing-library/react';
import React, { Component } from 'react';
import Welcome from './Welcome'
import Login from './Login'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Home'

type MainPage = {

}

export class Main extends Component<{}, MainPage>{

    render() {
        return <div>
            <Switch>
                <Route path="/" component={Welcome} exact />
                <Route path="/login" component={Login} />
                <Route path="/home" component={Home}></Route>

            </Switch>
        </div>
    }
}

export default Main;
