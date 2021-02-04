import Container from './partials/container/Container';
import { render } from '@testing-library/react';
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'

type HomePage = {

}

export class Home extends Component<{}, HomePage>{

    render() {
        return <div>
            <Container>
                <div>
                    Welcome to ERP app frontend
      </div>
            </Container>
        </div>
    }
}

export default Home;

