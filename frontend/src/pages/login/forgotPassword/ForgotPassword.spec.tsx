import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import ForgotPassword from './ForgotPassword';

const setup = () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <ForgotPassword />
    </Router>
  );
  const form = document.querySelector('form') as HTMLFormElement;
  const email = document.querySelector('input[name="email"]') as HTMLInputElement;
  return { form, email };
};

test('cannot submit form if email is empty', () => {
  const { form, email } = setup();

  email.value = '';
  expect(form.checkValidity()).toBeFalsy();
});

test('cannot submit form if email is not an email', () => {
  const { form, email } = setup();

  email.value = 'I am not an email';
  expect(form.checkValidity()).toBeFalsy();
});

test('can submit form if email an email', () => {
  const { form, email } = setup();

  email.value = 'email@email.com';
  expect(form.checkValidity()).toBeTruthy();
});
