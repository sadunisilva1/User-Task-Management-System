import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
console.log("API_URL",API_URL);

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Set up axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Set Authorization header
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers['x-auth-token'] = token;
  return config;
});

// API Methods
//Auth APIs
export const userSignup = (userData) => api.post('/auth/signup', userData);
export const userLogin = (userData) => api.post('/auth/login', userData);

//Tasks APIs
export const getTasks = () => api.get('/tasks');
export const addTask = (taskData) => api.post('/tasks', taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
