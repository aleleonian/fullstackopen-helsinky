const dummy = () => 1;

const totalLikes = (blogs) => {
  const accumulator = 0;
  return blogs.reduce((previous, current) => accumulator + current.likes, accumulator);
};

const mostLikes = (blogs) => {
  const authors = {};

  for (let i = 0; i < blogs.length; i++) {
    authors[blogs[i].author] = (authors[blogs[i].author] || 0) + blogs[i].likes;
  }

  const authorsArray = Object.entries(authors);

  // Change to a[1] - b[1] for ascending order
  authorsArray.sort((a, b) => b[1] - a[1]);

  return { author: authorsArray[0][0], likes: authorsArray[0][1] };
};

const mostBlogs = (blogs) => {
  const authors = {};
  for (let i = 0; i < blogs.length; i++) {
    authors[blogs[i].author] = (authors[blogs[i].author] || 0) + 1;
  }
  const authorsArray = Object.entries(authors);

  // Sort the array based on the values
  authorsArray.sort((a, b) => b[1] - a[1]);
  return {
    [authorsArray[0][0]]: authorsArray[0][1],
  };
};
const favoriteBlog = (blogs) => {
  let favoriteBlogIndex;

  for (let i = 0; i < blogs.length; i++) {
    if (!favoriteBlogIndex) {
      favoriteBlogIndex = i;
    } else if (blogs[i].likes > blogs[favoriteBlogIndex].likes) {
      favoriteBlogIndex = i;
    }
  }
  return favoriteBlogIndex ? blogs[favoriteBlogIndex] : false;
};

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes,
};
