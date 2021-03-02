import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { AuthProvider } from '../../contexts';
import Container from './Container';

test('displays children', () => {
  const history = createMemoryHistory();
  const randomKey = Math.random();
  render(
    <AuthProvider>
      <Router history={history}>
        <Container>
          <p>{randomKey}</p>
        </Container>
      </Router>
    </AuthProvider>
  );
  const children = screen.getByText(randomKey);
  expect(children).toBeInTheDocument();
});
