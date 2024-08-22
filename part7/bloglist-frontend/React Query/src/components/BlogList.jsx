import { useContext, useRef } from 'react';
import BlogContext from '../BlogContext';
import { Notification } from './Notification';
import { NewBlogpostForm } from './NewBlogpostForm';
import loginService from '../services/login';
import Blog from './Blog';
import { errorMessageAlert, successMessageAlert } from "../library/alerts";

const newBlogpostHandler = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const newBlogpostObject = {};

    for (const [key, value] of formData.entries()) {
        newBlogpostObject[key] = value;
    }

    blogService
        .create(newBlogpostObject)
        .then((response) => {
            const newBlogpostsArray = [...blogs];
            newBlogpostObject.id = response.data.id;
            const loggedUser = JSON.parse(
                window.localStorage.getItem('loggedBlogpostAppUser')
            );
            if (loggedUser) {
                newBlogpostObject.user = {};
                newBlogpostObject.user.username = loggedUser.username;
                newBlogpostObject.user.name = loggedUser.name;
                newBlogpostObject.user.id = loggedUser.id;
            }
            newBlogpostsArray.push(newBlogpostObject);
            dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: 'Blogpost created succesfully!' });
            cleanup();
            dispatch({ type: 'SET_BLOGS', payload: newBlogpostsArray });
            blogpostFormRef.current.toggleVisibility();
            setTimeout(() => {
                dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: null });
            }, 5000);

            // now gotta add the new blogpost locally
            // by making a new object from what was returned
        })
        .catch((exception) => {
            // setErrorMessage(
            //   `Error creating blogpost: ${exception.response.data.error
            //     ? exception.response.data.error
            //     : exception.message
            //   }`
            // );
            dispatch({
                type: 'SET_ERROR_MESSAGE', payload: `Error creating blogpost: ${exception.response.data.error
                    ? exception.response.data.error
                    : exception.message
                    }`
            });
            setTimeout(() => {
                dispatch({
                    type: 'SET_ERROR_MESSAGE', payload: null
                });
            }, 5000);
        });
};

const increaseLikes = (blogObj) => {
    blogService
        .update(blogObj)
        .then((response) => {
            blogObj.likes = response.data.likes;
            updateThisBlogpost(blogObj);
        })
        .catch((error) => {
            errorMessageAlert(
                error.response.data.error ? error.response.data.error : error.message
            );
            setTimeout(() => {
                errorMessageAlert(null);
            }, 5000);
        });
};


const cleanup = () => {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('url').value = '';
};


const updateThisBlogpost = (updatedBlogpost) => {
    const desiredBlogIndex = state.blogs.findIndex(
        (blog) => blog.id === updatedBlogpost.id
    );
    const newBlogpostsArray = [...blogs];
    newBlogpostsArray[desiredBlogIndex] = updatedBlogpost;
    dispatch({ type: 'SET_BLOGS', payload: newBlogpostsArray });
};

const removeThisBlogpost = (removedBlogpostId) => {
    const updatedBlogposts = [...blogs];
    const removedBpIndex = state.blogs.findIndex(
        (blog) => blog.id === removedBlogpostId
    );
    updatedBlogposts.splice(removedBpIndex, 1);
    dispatch({ type: 'SET_BLOGS', payload: updatedBlogposts });
};

export const BlogList = () => {
    const { state, dispatch } = useContext(BlogContext);
    const blogpostFormRef = useRef();

    return (
        <>
            <Notification message={state.successMessage} type="success" />
            <Notification message={state.errorMessage} type="error" />
            <h2>blogs</h2>
            {state.user.name} is logged in <button onClick={loginService.logOut}>log out</button>
            <NewBlogpostForm createBlogpost={newBlogpostHandler} reference={blogpostFormRef} />
            {state.blogs.map((blog) => {
                return (
                    <Blog
                        key={blog.id}
                        blog={blog}
                        increaseLikes={increaseLikes}
                        updateThisBlogpost={updateThisBlogpost}
                        removeThisBlogpost={removeThisBlogpost}
                        errorMessageAlert={errorMessageAlert}
                        successMessageAlert={successMessageAlert}
                    />
                );
            })}
        </>
    );
};