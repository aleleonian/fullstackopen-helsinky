import React from "react";
import Togglable from './Togglable';

export const Form = ({ createBlogpost, reference }) => {
    return (
        <>
            <Togglable buttonLabel="Add new blogpost" ref={reference}>
                <div>
                    <h2>Create a new blogpost</h2>
                    <form id="newBlogpost">
                        <div>
                            title: <input id="title" name="title" />
                        </div>
                        <div>
                            author: <input id="author" name="author" />
                        </div>
                        <div>
                            url: <input id="url" name="url" />
                        </div>
                        <div>
                            <button onClick={createBlogpost}>create</button>
                        </div>
                    </form>
                </div>
            </Togglable>
        </>
    )
}