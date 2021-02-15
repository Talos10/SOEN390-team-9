import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import { Home } from './pages';

test('renders title', () => {
  const history = createMemoryHistory()
  render(<Router history={history}><Home /></Router>);
  const linkElement = screen.getByText(/Welcome/i);
  expect(linkElement).toBeInTheDocument();
});