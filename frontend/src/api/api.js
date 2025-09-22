import api from './axiosConfig';

// User Authentication
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

// Projects
export const getProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};

export const createProject = async (name, description) => {
  const response = await api.post('/projects', { name, description });
  return response.data;
};

// Agents
export const createAgent = async (agentData) => {
  const response = await api.post('/agents', agentData);
  return response.data;
};

export const getAgentsForProject = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/agents`);
  return response.data;
};

// Chat
export const sendMessageToAgent = async (agentId, message) => {
  const response = await api.post(`/chat/${agentId}`, { msg: message });
  return response.data;
};
