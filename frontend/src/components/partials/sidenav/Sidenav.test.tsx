import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidenav from './Sidenav';

let showSidenav: boolean;
const toggleSidenav: any = (val: boolean) => showSidenav = val;

test('clicking shadow closes sidenav', () => {
  showSidenav = true; 
  render(<Sidenav {...{showSidenav, toggleSidenav}}/>);
  screen.getByRole("button").click()
  expect(showSidenav).toBeFalsy();
});
