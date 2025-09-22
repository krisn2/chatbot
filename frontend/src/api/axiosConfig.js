import axios from 'axios';

// Create a new instance of Axios with a base URL and cookie handling
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export default api;
