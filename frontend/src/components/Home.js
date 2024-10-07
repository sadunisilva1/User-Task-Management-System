import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskList from './Task/TaskList';
import { Button, Container, Navbar, Nav } from 'react-bootstrap';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleUserLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    navigate('/login');  // Redirect to the login page
  };

  return (
    // <div>
    //   <h1>Home Page</h1>
    //   {isAuthenticated ? (
    //     <>
    //       <TaskList /> {/* Display the task management section */}
    //       <button onClick={handleUserLogout}>Logout</button>
    //     </>
    //   ) : (
    //     <p>Redirecting to login...</p>
    //   )}
    // </div>

    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Task Manager</Navbar.Brand>
          <Nav className="ml-auto">
            {isAuthenticated && (
              <Button variant="outline-light" onClick={handleUserLogout}>
                Logout
              </Button>
            )}
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-5">
        {isAuthenticated ? (
          <TaskList /> // Task management section
        ) : (
          <p>Redirecting to login...</p>
        )}
      </Container>
    </div>
  );
};

export default Home;
