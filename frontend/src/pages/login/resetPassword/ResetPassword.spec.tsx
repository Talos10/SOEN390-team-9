import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import ResetPassword from './ResetPassword';

const setup = () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <ResetPassword />
    </Router>
  );
  const form = document.querySelector('form') as HTMLFormElement;
  const password = document.querySelector('input[name="password"]') as HTMLInputElement;
  const confirm = document.querySelector('input[name="confirm"]') as HTMLInputElement;
  return { form, password, confirm };
};

test('cannot submit form if password is empty', () => {
  const { form, password, confirm } = setup();

  password.value = '';
  confirm.value = 'foo';
  expect(form.checkValidity()).toBeFalsy();
});

test('cannot submit form if confirm is empty', () => {
  const { form, password, confirm } = setup();

  password.value = 'bar';
  confirm.value = '';
  expect(form.checkValidity()).toBeFalsy();
});

test('can submit form if password and confirm are not empty', () => {
  const { form, password, confirm } = setup();

  password.value = 'password';
  confirm.value = 'password';
  expect(form.checkValidity()).toBeTruthy();
});
