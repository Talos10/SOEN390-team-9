import React from 'react';
import { render } from '@testing-library/react';
import Appbar from './Appbar';

let showSidenav: boolean;
const toggleSidenav: any = (val: boolean) => (showSidenav = val);

test('toggles sidenav state from off to on', () => {
  showSidenav = false;

  render(<Appbar {...{ showSidenav, toggleSidenav }} />);
  const btn = document.querySelector('.Appbar__menu') as HTMLButtonElement;
  btn.click();
  expect(showSidenav).toBeTruthy();
});

test('toggles sidenav state from on to off', () => {
  showSidenav = true;

  render(<Appbar {...{ showSidenav, toggleSidenav }} />);
  const btn = document.querySelector('.Appbar__menu') as HTMLButtonElement;
  btn.click();
  expect(showSidenav).toBeFalsy();
});
