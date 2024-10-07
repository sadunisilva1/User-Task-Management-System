import React, { useState, useEffect } from 'react';
import { getTasks, deleteTask } from '../../services/api';
import TaskForm from './TaskForm';
import { Container, Table, Button, Card, Alert } from 'react-bootstrap';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({err: false, msg:''});
  const [alertVisibility, setAlertVisibility] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if(message.msg !== ''){
      showHideAlert();
    }
  }, [message]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setMessage({...message, err:false, msg:'Successfully Deleted'});
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      setMessage({...message, err:true, msg:'Error occured when deleting'});
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
  };

  const handleEditCallback = (isFormReset) => {
    setEditTask(null);
    if(!isFormReset){
      setMessage({...message, err:false, msg:'Successfully Updated'});
      fetchTasks();
    }
    
  };

  const showHideAlert = () => {
    setAlertVisibility(true);
    setTimeout(() => {
      setAlertVisibility(false);
      setMessage({...message, err: false, msg:''})
  }, 6000);
  }

  if (loading) {
    return <p>Loading tasks...</p>;
  }

return (
    // <div>
    //   <h2>Task Management</h2>
    //   {message.err && <p style={{ color: 'red' }}>{message.msg}</p>}
    //   {!message.err && <p style={{ color: 'green' }}>{message.msg}</p>}
    //   {/* Task Form: add a new task or edit existing task */}
    //   <TaskForm task={editTask} onSuccess={handleSuccess} />

    //   {/* Task List */}
    //   <ul>
    //     {tasks.length > 0 ? (
    //       tasks.map((task) => (
    //         <li key={task._id}>
    //           <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
    //             <h3>{task.title}</h3>
    //             <p>{task.description}</p>
    //             <p>Priority: {task.priority}</p>
    //             <p>Status: {task.status}</p>

    //             {/* Edit and Delete buttons */}
    //             <button onClick={() => handleEdit(task)}>Edit</button>
    //             <button onClick={() => handleDelete(task._id)}>Delete</button>
    //           </div>
    //         </li>
    //       ))
    //     ) : (
    //       <p>No tasks available. Please add a task.</p>
    //     )}
    //   </ul>
    // </div>
    <Container className="mt-5">
          <Alert variant={message.err ? 'danger': 'success'} show={alertVisibility}>{message.msg}</Alert>
      <Card>
        <Card.Body>
          <Card.Title>Task Management Section</Card.Title>
          <TaskForm task={editTask} handleEditCallback={handleEditCallback}/>
          {/* <TaskForm task={editTask} onSuccess={handleSuccess} /> */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Task Title</th>
                <th>Task Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? 
              <tr><td colSpan={6}>No tasks available. Please add a task.</td></tr>
              :
              tasks.map((task, index) => (
                <tr key={task._id}>
                  <td>{index + 1}</td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.priority}</td>
                  <td>{task.status}</td>
                  <td>
                    <Button variant="warning" className="me-2" onClick={() => handleEdit(task)}>Edit</Button>
                    <Button variant="danger" onClick={() => handleDelete(task._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
              
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TaskList;
