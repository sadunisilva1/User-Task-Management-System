// components/TaskForm.js
import React, { useState, useEffect } from 'react';
import { addTask, updateTask } from '../../services/api';
import { Form, Button, Container, Col, Row } from 'react-bootstrap';

const TaskForm = ({ task, handleEditCallback }) => {
  // const [formData, setFormData] = useState({
  //   title: '',
  //   description: '',
  //   priority: 'Low',
  //   status: 'To Do'
  // });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [status, setStatus] = useState('To Do');

  useEffect(() => {
    if (task !== null) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setStatus(task.status);

    }
  }, [task]);

  // const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleReset = async (e) => {
    e.preventDefault();
     // Clear form fields
     setTitle('');
     setDescription('');
     setPriority('Low');
     setStatus('To Do');
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (task !== null) {
        await updateTask(task._id, {
          title: title,
          description: description,
          priority: priority,
          status: status
        });
      } else {
        await addTask({
          title: title,
          description: description,
          priority: priority,
          status: status
        });
      }
       // Clear form fields
      setTitle('');
      setDescription('');
      setPriority('Low');
      setStatus('To Do');

      handleEditCallback(false);
      
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  return (
    // <form onSubmit={handleSubmit}>
    //   <input
    //     type="text"
    //     name="title"
    //     placeholder="Task Title"
    //     value={formData.title}
    //     onChange={handleChange}
    //     required
    //   />
    //   <textarea
    //     name="description"
    //     placeholder="Task Description"
    //     value={formData.description}
    //     onChange={handleChange}
    //     required
    //   />
    //   <select name="priority" value={formData.priority} onChange={handleChange}>
    //     <option value="Low">Low</option>
    //     <option value="Medium">Medium</option>
    //     <option value="High">High</option>
    //   </select>
    //   <select name="status" value={formData.status} onChange={handleChange}>
    //     <option value="To Do">To Do</option>
    //     <option value="In Progress">In Progress</option>
    //     <option value="Completed">Completed</option>
    //   </select>
    //   <button type="submit">{task ? 'Update Task' : 'Add Task'}</button>
    // </form>
    <Container className="mt-4">
      <h2>{task !== null ? 'Edit Task' : 'Add New Task'}</h2>
      <Form onSubmit={handleSubmit} onReset={handleReset}>
        <Form.Group className="mb-3" controlId="taskTitle">
          <Form.Label>Task Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="taskDescription">
          <Form.Label>Task Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="taskPriority">
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </Form.Control>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-3" controlId="taskStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>To Do</option>
                <option>In Progress</option>
                <option>Completed</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit">
        {task !== null ? 'Edit Task' : 'Add Task'}
        </Button>
        {task !== null ? 
        (<Button variant="outline-secondary" type='button' onClick={(e) => handleEditCallback(true)}>
          Cancel
        </Button>) :
        (<Button variant="outline-secondary" type='reset'>
          Clear
        </Button>)
        }
      </Form>
    </Container>
  );
};

export default TaskForm;
