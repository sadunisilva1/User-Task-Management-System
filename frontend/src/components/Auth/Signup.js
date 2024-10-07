import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userSignup } from "../../services/api";
import { Form, Button, Container, Alert } from 'react-bootstrap';

const Signup = () => {
  // const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({err: false, msg:''});
  const navigate = useNavigate();

  // const handleOnChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await userSignup({ name: name, email: email, password: password });
      console.log("login result",res);
      localStorage.setItem('token', res.data.token);
      setMessage({err:false,msg:'Signup successful!'});
      navigate('/login');
    } catch (err) {
      console.log("login error",err);
      setMessage({err:true,msg:'Error: ' + err.response.data.msg});
    }
  };

  return (
    // <div>
    //   <h1>Signup</h1>
    //   <form onSubmit={handleOnSubmit}>
    //     <input type="text" name="name" placeholder="Name" onChange={handleOnChange} required />
    //     <input type="email" name="email" placeholder="Email" onChange={handleOnChange} required />
    //     <input type="password" name="password" placeholder="Password" onChange={handleOnChange} required />
    //     <button type="submit">Sign Up</button>
    //     <p>{message}</p>
    //   </form>
    //   <p>Already have an account? <Link to="/login">Login here</Link></p>
    // </div>
    <Container className="mt-5">
      <h2>Signup</h2>
      {message.msg && <Alert variant={message.err ? 'danger' : 'success'}>{message.msg}</Alert>}
      <Form onSubmit={handleOnSubmit}>
      <Form.Group controlId="formName" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
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
          Signup
        </Button>
      </Form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </Container>
  );
};

export default Signup;
