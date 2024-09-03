import { useAuthCheck } from '../hooks/useAuthCheck';
import React, { useEffect, useState, useContext } from 'react';
import BlogContext from '../BlogContext';
import { useNavigate, useParams } from 'react-router-dom';
import blogService from '../services/blogs'; // Adjust the path as needed
import { Notification } from "./Notification";
import { Button } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';

const updateThisBlogpost = (blogs, updatedBlogpost, dispatch) => {

    const desiredBlogIndex = blogs.findIndex(
        (blog) => blog.id === updatedBlogpost.id
    );
    const newBlogpostsArray = [...blogs];
    newBlogpostsArray[desiredBlogIndex] = updatedBlogpost;
    dispatch({ type: 'SET_BLOGS', payload: newBlogpostsArray });
};


const increaseLikes = (blogs, blogObj, dispatch) => {

    blogService
        .update(blogObj)
        .then((response) => {
            blogObj.likes = response.data.likes;
            updateThisBlogpost(blogs, blogObj, dispatch);
        })
        .catch((error) => {
            dispatch({ type: 'SET_ERROR_MESSAGE', payload: error.response.data.error ? error.response.data.error : error.message });
        });
};

const successMessageAlert = (message, dispatch) => {
    dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: message });
    setTimeout(() => {
        dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: null });
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
    dispatch({ type: 'SET_BLOGS', payload: updatedBlogposts });
};


const errorMessageAlert = (message, dispatch) => {
    dispatch({ type: 'SET_ERROR_MESSAGE', payload: message });
    setTimeout(() => {
        dispatch({ type: 'SET_ERROR_MESSAGE', payload: null });
    }, 5000);
};

const showComments = (comments) => {
    if (comments.length > 0) {
        const jsxComments = comments.map((comment, index) => (
            <ListGroup.Item key={index}>{comment}</ListGroup.Item>
        )); return (
            <>
                <ListGroup>
                    {jsxComments}
                </ListGroup>
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

const Comments = ({ comments, blogId, updateBlogpostFunction, currentBlogpost, dispatch }) => {

    return (
        <>
            <h2>Comments</h2>
            {comments && showComments(comments)}
            <br />
            <input
                type="text"
                id="newComment"
                onKeyPress={() => { handleKeyPress(event, blogId, updateBlogpostFunction, currentBlogpost, dispatch) }}
            />
            &nbsp;
            <Button onClick={() => addComment(blogId, updateBlogpostFunction, currentBlogpost, dispatch)}>Add comment</Button>
        </>
    )
}

export const BlogpostDetail = () => {
    const { id } = useParams();
    const [desiredBlogpost, setDesiredBlogpost] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState("loading");
    const navigate = useNavigate();
    const { state, dispatch } = useContext(BlogContext);
    const blogs = state.blogs;
    const successMessage = state.successMessage;
    const errorMessage = state.errorMessage;

    useAuthCheck();

    useEffect(() => {
        if (!desiredBlogpost) {
            blogService.getById(id)
                .then((blogpost) => {
                    setDesiredBlogpost(blogpost);
                })
                .catch((error) => {
                    console.log('Error fetching blog details:', error);
                    dispatch({ type: 'SET_ERROR_MESSAGE', payload: `Error requesting user: ${error.response.data}` });
                });
        }
    }, [id, desiredBlogpost, dispatch]);

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
                <Button
                    className='button-class'
                    variant='success'
                    data-testid="like-button"
                    onClick={() => increaseLikes(blogs, desiredBlogpost, dispatch)}
                >
                    like
                </Button>

                <Button
                    variant='danger'
                    data-testid="remove-button"
                    onClick={() => removeBlogPost(desiredBlogpost, blogs, dispatch, setDesiredBlogpost, setLoadingMessage, navigate)}
                >
                    Remove
                </Button>

            </div>
            <p>added by {desiredBlogpost.author}</p>
            <Comments
                comments={desiredBlogpost.comments}
                blogId={desiredBlogpost.id}
                updateBlogpostFunction={setDesiredBlogpost}
                currentBlogpost={desiredBlogpost}
                dispatch={dispatch}
            />
        </div>
    );
};