const blog = require("../models/blog");

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    let accumulator = 0;
    return blogs.reduce((previous, current, index) => {
        return accumulator + current.likes
    }, accumulator)
}

const mostLikes = (blogs) => {
    let authors = {};

    for (let i = 0; i < blogs.length; i++) {
        authors[blogs[i].author] = (authors[blogs[i].author] || 0) + blogs[i].likes;
    }

    var authorsArray = Object.entries(authors);

    authorsArray.sort(function (a, b) {
        return b[1] - a[1]; // Change to a[1] - b[1] for ascending order
    });
    
    return { 'author': authorsArray[0][0], 'likes': authorsArray[0][1] }
}

const mostBlogs = (blogs) => {
    let authors = {};
    for (let i = 0; i < blogs.length; i++) {
        authors[blogs[i].author] = (authors[blogs[i].author] || 0) + 1;
    }
    var authorsArray = Object.entries(authors);

    // Sort the array based on the values
    authorsArray.sort(function (a, b) {
        return b[1] - a[1]; // Change to a[1] - b[1] for ascending order
    });
    return {
        [authorsArray[0][0]]: authorsArray[0][1]
    };
}
const favoriteBlog = (blogs) => {

    let favoriteBlogIndex;

    for (let i = 0; i < blogs.length; i++) {
        if (!favoriteBlogIndex) {
            favoriteBlogIndex = i;
            continue;
        }
        else {
            if (blogs[i].likes > blogs[favoriteBlogIndex].likes) {
                favoriteBlogIndex = i;
            }
        }
    }
    return favoriteBlogIndex ? blogs[favoriteBlogIndex] : false;
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}