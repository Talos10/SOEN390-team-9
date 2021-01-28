import { render } from '@testing-library/react';
import React, { Component } from 'react';
import styles from '../css/WelcomeButtons.module.css'
//import Button from 'react-bootstrap/Button'

type WelcomeButtonsPage = {

}

export class WelcomeButtons extends Component<{}, WelcomeButtonsPage>{

    render() {
        return <div>
            <table>
                <tr>
                    <td>
                    <button className={styles.Logbutton}>Log in</button>
                    </td>
                    <td>
                        <p></p>
                    </td>
                    <td>
                        Not a member? <a href="#example">Create an account</a>
                    </td>
                </tr>
            </table>
        </div>
    }
}

export default WelcomeButtons;

