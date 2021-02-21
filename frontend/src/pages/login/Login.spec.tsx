import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import Login from './Login';

const setup = () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <Login />
    </Router>
  );
  const form = document.querySelector('form') as HTMLFormElement;
  const email = document.querySelector('input[name="email"]') as HTMLInputElement;
  const password = document.querySelector('input[name="password"]') as HTMLInputElement;
  return { form, email, password };
};

test('cannot submit form if email is empty', () => {
  const { form, email, password } = setup();

  email.value = '';
  password.value = 'foo';
  expect(form.checkValidity()).toBeFalsy();
});

test('cannot submit form if password is empty', () => {
  const { form, email, password } = setup();

  email.value = 'bar';
  password.value = '';
  expect(form.checkValidity()).toBeFalsy();
});

test('cannot submit form if email is not an email', () => {
  const { form, email, password } = setup();

  email.value = 'I am not an email';
  password.value = 'foo';
  expect(form.checkValidity()).toBeFalsy();
});

test('can submit form if email is an email, and password is not empty', () => {
  const { form, email, password } = setup();

  email.value = 'john.doe@example.com';
  password.value = 'Password123';
  expect(form.checkValidity()).toBeTruthy();
});
