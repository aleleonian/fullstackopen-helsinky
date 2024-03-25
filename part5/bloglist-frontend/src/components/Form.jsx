import React from 'react';
import Togglable from './Togglable';

export const Form = ({ createBlogpost, reference }) => {
  return (
    <>
      <Togglable buttonLabel="Add new blogpost" ref={reference}>
        <div>
          <h2>Create a new blogpost</h2>
          <form onSubmit={createBlogpost} id="newBlogpost">
            <div>
              title: <input id="title" data-testid="title" name="title" />
            </div>
            <div>
              author: <input id="author" data-testid="author" name="author" />
            </div>
            <div>
              url: <input id="url" data-testid="url" name="url" />
            </div>
            <div>
              <button data-testid="submit" type="submit">
                create
              </button>
            </div>
          </form>
        </div>
      </Togglable>
    </>
  );
};
