import { Container } from '../../components';
import React, { Component } from 'react';

type HomePage = {};

export class Home extends Component<{}, HomePage> {
  render() {
    return (
      <div>
        <Container>
          <div>Welcome {localStorage.getItem('name')}.</div>
        </Container>
      </div>
    );
  }
}

export default Home;
