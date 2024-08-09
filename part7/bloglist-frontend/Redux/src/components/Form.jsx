import React from 'react';
import Togglable from './Togglable';
import { Form, Button } from 'react-bootstrap'

export const NewBlogpostForm = ({ createBlogpost, reference }) => {
  return (
    <>
      <Togglable buttonLabel="Add new blogpost" ref={reference}>
        <h2>Create a new blogpost</h2>
        <Form onSubmit={createBlogpost} id="newBlogpost">
          <Form.Group>
            <Form.Label>title:</Form.Label>
            <Form.Control id="title" data-testid="title" name="title" />
          </Form.Group>
          <Form.Group>
            <Form.Label>author:</Form.Label>
            <Form.Control id="author" data-testid="author" name="author" />
          </Form.Group>
          <Form.Group>
            <Form.Label>url:</Form.Label>
            <Form.Control id="url" data-testid="url" name="url" />
          </Form.Group>
          <Form.Group>
            <Button className="button-class" data-testid="submit" type="submit">
              create
            </Button>
          </Form.Group>
        </Form>
      </Togglable>
    </>
  );
};
