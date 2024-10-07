import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import Home from './components/Home';
// import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/' element={<Login/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
