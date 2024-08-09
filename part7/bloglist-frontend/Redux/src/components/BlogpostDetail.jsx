import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import blogService from '../services/blogs'; // Adjust the path as needed
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, setErrorMessage, setBlogs, setSuccessMessage } from '../actions';
import { Notification } from "./Notification";

const selectUser = (state) => state.user;
const selectErrorMessage = (state) => state.errorMessage;
const selectBlogs = (state) => state.blogs;
const selectSuccessMessage = (state) => state.successMessage;

const updateThisBlogpost = (blogs, updatedBlogpost, dispatch) => {

    const desiredBlogIndex = blogs.findIndex(
        (blog) => blog.id === updatedBlogpost.id
    );
    const newBlogpostsArray = [...blogs];
    newBlogpostsArray[desiredBlogIndex] = updatedBlogpost;
    dispatch(setBlogs(newBlogpostsArray));
};


const increaseLikes = (blogs, blogObj, dispatch) => {

    blogService
        .update(blogObj)
        .then((response) => {
            blogObj.likes = response.data.likes;
            updateThisBlogpost(blogs, blogObj, dispatch);
        })
        .catch((error) => {

            dispatch(setErrorMessage(
                error.response.data.error ? error.response.data.error : error.message
            ));
        });
};
const successMessageAlert = (message, dispatch) => {
    dispatch(setSuccessMessage(message));
    setTimeout(() => {
        dispatch(setSuccessMessage(null));
    }, 5000);
};

const removeBlogPost = (blogpost, blogs, dispatch, setDesiredBlogpost, setLoadingMessage, navigate) => {
    if (confirm(`Do you really want to delete blogpost "${blogpost.title}"`)) {
        blogService
            .remove(blogpost)
            .then((response) => {
                removeThisBlogpost(blogpost.id, blogs, dispatch, setDesiredBlogpost);
                successMessageAlert('Blogpost removed allright!', dispatch);
                setLoadingMessage(null);
                navigate('/');
            })
            .catch((error) => {
                errorMessageAlert(
                    error.response.data ? error.response.data.error : error.message,
                    dispatch
                );
                setTimeout(() => {
                    errorMessageAlert(null, dispatch);
                }, 5000);
            });
    }
};

const removeThisBlogpost = (removedBlogpostId, blogs, dispatch, setDesiredBlogpost) => {
    const updatedBlogposts = [...blogs];
    const removedBpIndex = blogs.findIndex(
        (blog) => blog.id === removedBlogpostId
    );
    updatedBlogposts.splice(removedBpIndex, 1);
    setDesiredBlogpost(null);
    dispatch(setBlogs(updatedBlogposts));
};


const errorMessageAlert = (message, dispatch) => {
    dispatch(setErrorMessage(message));
    setTimeout(() => {
        dispatch(setErrorMessage(null));
    }, 5000);
};

const showComments = (comments) => {
    if (comments.length > 0) {
        const jsxComments = comments.map((comment, index) => (
            <li key={index}>{comment}</li>
        )); return (
            <>
                <ul>
                    {jsxComments}
                </ul>
            </>
        )
    }

}

const addComment = (blogId, updateBlogpostFunction, currentBlogpost, dispatch) => {
    //blogid is sometimes undefined and i don't know why
    if (!blogId) return;
    const comment = document.getElementById("newComment").value;
    if (!comment || comment.length < 1) {
        errorMessageAlert('You gotta input something, bro.', dispatch);
        return;
    }
    else {
        blogService.addComment(blogId, comment)
            .then(response => {
                console.log(response);
                const updatedBlogpost = { ...currentBlogpost };
                updatedBlogpost.comments.push(comment)
                updateBlogpostFunction(updatedBlogpost);
                document.getElementById("newComment").value = "";
                successMessageAlert('Comment added!', dispatch);
            })
            .catch(error => {
                console.log(error);
                errorMessageAlert(error, dispatch);
            })
    }
}
const handleKeyPress = (event, blogId, updateBlogpostFunction, currentBlogpost, dispatch) => {
    if (event.key === 'Enter') {
        addComment(blogId, updateBlogpostFunction, currentBlogpost, dispatch);
    }
};

const Comments = ({ comments, blogId, updateBlogpostFunction, currentBlogpost }) => {
    const dispatch = useDispatch();

    return (
        <>
            <h2>Comments</h2>
            {comments && showComments(comments)}
            <input
                type="text"
                id="newComment"
                onKeyPress={() => { handleKeyPress(event, blogId, updateBlogpostFunction, currentBlogpost, dispatch) }}
            />
            &nbsp;
            <button onClick={() => addComment(blogId, updateBlogpostFunction, currentBlogpost, dispatch)}>Add comment</button>
        </>
    )
}
export const BlogpostDetail = () => {
    const { id } = useParams();
    const [desiredBlogpost, setDesiredBlogpost] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState("loading");
    const user = useSelector(selectUser);
    const errorMessage = useSelector(selectErrorMessage);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const blogs = useSelector(selectBlogs);
    const successMessage = useSelector(selectSuccessMessage);


    useEffect(() => {
        if (user === null) {
            const loggedUserJSON = window.localStorage.getItem('loggedBlogpostAppUser');
            if (loggedUserJSON) {
                const user = JSON.parse(loggedUserJSON);
                dispatch(setUser(user));
            } else {
                navigate('/');
            }
        }
    }, [user, navigate, dispatch]);

    useEffect(() => {
        if (user && !desiredBlogpost) {
            blogService.getById(id)
                .then((blogpost) => {
                    setDesiredBlogpost(blogpost);
                })
                .catch((error) => {
                    console.log('Error fetching blog details:', error);
                    dispatch(setErrorMessage(error.response.data));
                });
        }
    }, [id, user, desiredBlogpost, dispatch]);

    if (!desiredBlogpost) {
        return (
            <div>
                {errorMessage && <Notification message={errorMessage} type="danger" />}
                {successMessage && <Notification message={successMessage} type="success" />}
                {!errorMessage && loadingMessage}
            </div>
        );
    }
    return (
        <div>
            <Notification message={successMessage} type="success" />
            <Notification message={errorMessage} type="danger" />

            <h1>{desiredBlogpost.title}</h1>
            <p>{desiredBlogpost.url}</p>
            <div>
                {desiredBlogpost.likes} likes
                <button
                    data-testid="like-button"
                    onClick={() => increaseLikes(blogs, desiredBlogpost, dispatch)}
                >
                    like
                </button>

                <button
                    data-testid="remove-button"
                    onClick={() => removeBlogPost(desiredBlogpost, blogs, dispatch, setDesiredBlogpost, setLoadingMessage, navigate)}
                >
                    remove
                </button>

            </div>
            <p>added by {desiredBlogpost.author}</p>
            <Comments
                comments={desiredBlogpost.comments}
                blogId={desiredBlogpost.id}
                updateBlogpostFunction={setDesiredBlogpost}
                currentBlogpost={desiredBlogpost}
            />
        </div>
    );
};