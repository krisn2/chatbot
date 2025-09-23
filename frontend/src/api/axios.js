import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API || 'https://chatbot-backend-63qf.onrender.com/',
  withCredentials: true
})

export default api
