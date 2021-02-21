import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import ProfileOptions from './ProfileOptions';
import { AuthProvider } from '../../../../contexts/Auth';

let isProfileOptionOpened: boolean;
const setProfileOption: any = (val: boolean) => (isProfileOptionOpened = val);

test('clicking shadow closes modal', () => {
  isProfileOptionOpened = true;
  const history = createMemoryHistory();
  render(
    <AuthProvider>
      <Router history={history}>
        <ProfileOptions {...{ setProfileOption }} />
      </Router>
    </AuthProvider>
  );
  const shadow = document.querySelector('.ProfileOptions-shadow') as HTMLButtonElement;
  shadow.click();
  expect(isProfileOptionOpened).toBeFalsy();
});
