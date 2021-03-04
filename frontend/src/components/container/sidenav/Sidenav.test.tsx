import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import Sidenav from './Sidenav';
import { AuthProvider } from '../../../contexts';

let showSidenav: boolean;
const toggleSidenav: any = (val: boolean) => (showSidenav = val);

test('clicking shadow closes sidenav', () => {
  showSidenav = true;
  const history = createMemoryHistory();
  render(
    <AuthProvider>
      <Router history={history}>
        <Sidenav {...{ showSidenav, toggleSidenav }} />
      </Router>
    </AuthProvider>
  );
  const shadow = document.querySelector('.SidenavShadow') as HTMLButtonElement;
  shadow.click();
  expect(showSidenav).toBeFalsy();
});
