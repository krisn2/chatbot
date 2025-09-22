import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API || 'http://localhost:5000/api',
  withCredentials: true // IMPORTANT: backend uses cookie token
})

export default api