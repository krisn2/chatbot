import React, { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { projectsState, agentsState, viewState, activeChatState } from '../recoil/atmos';
import { createProject, createAgent, getAgentsForProject } from '../api/api';

const Dashboard = () => {
  const [projects, setProjects] = useRecoilState(projectsState);
  const [agents, setAgents] = useRecoilState(agentsState);
  const setView = useSetRecoilState(viewState);
  const setActiveChat = useSetRecoilState(activeChatState);

  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [newAgent, setNewAgent] = useState({
    name: '',
    model: 'gpt-4o-mini',
    prompt: '',
    projectId: '',
  });

  const [createProjectError, setCreateProjectError] = useState('');
  const [createAgentError, setCreateAgentError] = useState('');

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreateProjectError('');
    try {
      const createdProject = await createProject(newProject.name, newProject.description);
      setProjects([...projects, createdProject]);
      setNewProject({ name: '', description: '' });
    } catch (error) {
      setCreateProjectError(error.response?.data?.message || 'Failed to create project.');
    }
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    setCreateAgentError('');
    try {
      const { name, model, prompt, projectId } = newAgent;
      const agentData = {
        name,
        model,
        prompt: { system: prompt, examples: [] },
        projectId,
      };
      const createdAgent = await createAgent(agentData);

      setAgents((prevAgents) => ({
        ...prevAgents,
        [projectId]: [...(prevAgents[projectId] || []), createdAgent],
      }));
      setNewAgent({ name: '', model: 'gpt-4o-mini', prompt: '', projectId: '' });
    } catch (error) {
      setCreateAgentError(error.response?.data?.message || 'Failed to create agent.');
    }
  };

  const fetchAgents = async (projectId) => {
    if (agents[projectId]) return;
    try {
      const fetchedAgents = await getAgentsForProject(projectId);
      setAgents((prev) => ({ ...prev, [projectId]: fetchedAgents }));
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
  };

  const handleStartChat = (agentId, agentName) => {
    setActiveChat({ agentId, messages: [], agentName });
    setView('chat');
  };

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700">Create New Project</h2>
        <form onSubmit={handleCreateProject} className="space-y-4">
          {createProjectError && <p className="text-red-500 text-sm">{createProjectError}</p>}
          <input
            type="text"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            placeholder="Project Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          ></textarea>
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors">
            Create Project
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700">Create New Agent</h2>
        <form onSubmit={handleCreateAgent} className="space-y-4">
          {createAgentError && <p className="text-red-500 text-sm">{createAgentError}</p>}
          <input
            type="text"
            placeholder="Agent Name"
            value={newAgent.name}
            onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            value={newAgent.projectId}
            onChange={(e) => setNewAgent({ ...newAgent, projectId: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a Project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Model (e.g., gpt-4o-mini)"
            value={newAgent.model}
            onChange={(e) => setNewAgent({ ...newAgent, model: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            placeholder="System Prompt"
            value={newAgent.prompt}
            onChange={(e) => setNewAgent({ ...newAgent, prompt: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          ></textarea>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
            Create Agent
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700">Your Projects & Agents</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500 text-center">No projects found. Create one above!</p>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => fetchAgents(project._id)}
              >
                <div className="flex flex-col">
                  <h3 className="text-xl font-medium text-gray-800">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </div>
                <span className="text-gray-500">
                  {agents[project._id] ? '▲' : '▼'}
                </span>
              </div>
              {agents[project._id] && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold text-gray-700">Agents:</h4>
                  {agents[project._id].length === 0 ? (
                    <p className="text-gray-500 text-sm">No agents found for this project.</p>
                  ) : (
                    <ul className="space-y-2">
                      {agents[project._id].map((agent) => (
                        <li key={agent._id} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                          <div>
                            <p className="font-medium">{agent.name}</p>
                            <p className="text-xs text-gray-500">Model: {agent.model}</p>
                          </div>
                          <button
                            onClick={() => handleStartChat(agent._id, agent.name)}
                            className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-purple-600 transition-colors"
                          >
                            Chat
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
