import React from 'react';
import { render, screen } from '@testing-library/react';
import Container from './Container';

test('displays children', () => {
  const randomKey = Math.random();
  render(<Container><p>{randomKey}</p></Container>);
  const children = screen.getByText(randomKey);
  expect(children).toBeInTheDocument();
});
