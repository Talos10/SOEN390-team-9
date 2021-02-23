import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import Sidenav from './Sidenav';

let showSidenav: boolean;
const toggleSidenav: any = (val: boolean) => (showSidenav = val);

test('clicking shadow closes sidenav', () => {
  showSidenav = true;
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <Sidenav {...{ showSidenav, toggleSidenav }} />
    </Router>
  );
  screen.getByRole('button').click();
  expect(showSidenav).toBeFalsy();
});
