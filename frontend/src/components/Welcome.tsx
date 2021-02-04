import { render } from '@testing-library/react';
import React, { Component } from 'react';
import style from '../css/Welcome.module.css'
import WelcomeButtons from './WelcomeButtons'
import Button from 'react-bootstrap/Button'

type WelcomePage = {

}

export class Welcome extends Component<{}, WelcomePage>{

    render() {
        return <div>
            <h1 className={style.centerMessage}>Welcome to Supreme ERP</h1>

            <div className={style.centerComponent}>
                <WelcomeButtons></WelcomeButtons>
            </div>
            

        </div>

        
    }
}

export default Welcome;

