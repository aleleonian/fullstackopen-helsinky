import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

test('renders content', async () => {
  const newBlog = {
    title: 'Component testing is done with react-testing-library',
    url: 'http://www.bugle.com',
    likes: 0,
    author: 'LatexX',
  };

  const mockHandler = vi.fn();

  render(<Blog blog={newBlog} increaseLikes={mockHandler} />);

  let element = screen.getByText(
    'Component testing is done with react-testing-library'
  );
  expect(element).toBeDefined();
  // screen.debug();

  // let's hope NOT to find the url displayed yet
  element = screen.queryByText('http://www.bugle.com');
  expect(element).toBeNull();

  // let's click the button...
  const user = userEvent.setup();
  let button = screen.getByText('view');
  await user.click(button);
  // screen.debug();

  //...and hope to find the url displayed
  element = screen.getByText('http://www.bugle.com');
  expect(element).toBeDefined();
  element = screen.getByText('like');
  expect(element).toBeDefined();

  //let's click the 'like' button twice.
  button = screen.getByText('like');
  await user.click(button);
  await user.click(button);
  expect(mockHandler.mock.calls).toHaveLength(2);
});
