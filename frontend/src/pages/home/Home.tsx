import { Container } from '../../components';
import React, { Component } from 'react';

type HomePage = {};

export class Home extends Component<{}, HomePage> {
  render() {
    return (
      <Container title="Home">
        <div>Welcome {localStorage.getItem('name')}.</div>
      </Container>
    );
  }
}

export default Home;
