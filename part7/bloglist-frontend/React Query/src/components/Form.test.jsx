import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from './Form';

test('Creates a new blogpost', async () => {
  // Mock handler function
  const newBlogpostHandler = vi.fn();

  const { container } = render(<Form createBlogpost={newBlogpostHandler} />);

  // Input values
  const values = {
    title: 'Hello, world!',
    author: 'Cacho Castaña',
    url: 'www.google.com.ars',
  };

  const form = container.querySelector('#newBlogpost');

  // Set values for inputs
  const inputs = Object.keys(values);
  inputs.forEach((input) => {
    fireEvent.change(container.querySelector(`#${input}`), {
      target: { value: values[input] },
    });
  });

  // Submit form
  fireEvent.submit(form);

  // Check if the mock handler has been called
  expect(newBlogpostHandler).toHaveBeenCalled();

  const submittedValues = {};

  // Mimic the FormData object creation from event.target
  const formData = new FormData(form);
  formData.forEach((value, key) => {
    submittedValues[key] = value;
  });

  // Ensure that the submitted values match the expected values
  expect(submittedValues).toEqual(values);
});
