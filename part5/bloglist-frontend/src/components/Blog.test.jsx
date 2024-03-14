import { render, screen } from '@testing-library/react';
import Blog from './Blog';

test('renders content', () => {
  const newBlog = {
    title: 'Component testing is done with react-testing-library',
    url: 'http://www.bugle.com',
    likes:0,
    author: 'LatexX',
  };

  render(<Blog blog={newBlog} />);

  let element = screen.getByText('Component testing is done with react-testing-library');
  expect(element).toBeDefined();
  element = screen.queryByText('http://www.bugle.com');
  expect(element).toBeNull();
});