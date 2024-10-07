import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userLogin } from "../../services/api";
import { Form, Button, Container, Alert } from 'react-bootstrap';

const Login = () => {
  // const [formData, setFormData] = useState({ email: '', password: '' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // const handleOnChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await userLogin({ email:email, password:password });
      localStorage.setItem('token', res.data.token);
      navigate('/home');
    } catch (err) {
      console.log("login error",err);
      setError('Error: ' + err.response.data.msg);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleOnSubmit}>
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" block>
          Login
        </Button>
      </Form>
      <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
    </Container>
  );
      
};

export default Login;
