import api from '../api/axios'

export async function register({ name, email, password }){
  return api.post('/auth/register', { name, email, password })
}

export async function login({ email, password }){
  // backend responds with cookie
  return api.post('/auth/login', { email, password })
}

export async function fetchMe(){
  // if backend has /auth/me (optional). If not, you can rely on cookie-based session endpoints like /projects to infer user
  return api.get('/auth/me')
}

export default api