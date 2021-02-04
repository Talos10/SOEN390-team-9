import Container from '../../components/partials/container/Container';
import React, { Component } from 'react';

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

