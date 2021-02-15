import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './WelcomeButtons.module.css'

type WelcomeButtonsPage = {

}

export class WelcomeButtons extends Component<{}, WelcomeButtonsPage>{

    render() {
        return <div>
            <table>
                <tr>
                    <td>
                        <Link to="/login">
                            <button className={styles.Logbutton}>Log in</button>
                        </Link>
                    </td>
                    <td>
                        <p></p>
                    </td>
                    <td>

                    </td>
                </tr>
            </table>
        </div>
    }
}

export default WelcomeButtons;

