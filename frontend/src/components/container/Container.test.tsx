import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import Container from './Container';

test('displays children', () => {
  const history = createMemoryHistory();
  const randomKey = Math.random();
  render(
    <Router history={history}>
      <Container>
        <p>{randomKey}</p>
      </Container>
    </Router>
  );
  const children = screen.getByText(randomKey);
  expect(children).toBeInTheDocument();
});
