import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { Home } from './pages';
import { AuthProvider } from './contexts';

test('renders title', () => {
  const history = createMemoryHistory();
  render(
    <AuthProvider>
      <Router history={history}>
        <Home />
      </Router>
    </AuthProvider>
  );
  const linkElement = screen.getByText(/Welcome/i);
  expect(linkElement).toBeInTheDocument();
});
