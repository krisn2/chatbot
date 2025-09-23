import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'

export default function ProjectDetail() {
  const { id } = useParams() // id from URL
  const [project, setProject] = useState(null)
  const [agents, setAgents] = useState([])
  const [agentForm, setAgentForm] = useState({
    name: '',
    model: 'gpt-4o-mini',
    promptText: '',
  })

  // Fetch project on mount
  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await api.get('/projects')
        const p = res.data.find(x => x._id === id)
        setProject(p)
      } catch (e) {
        console.error(e)
      }
    }
    fetchProject()
  }, [id])

  // Fetch agents only after project is loaded
  useEffect(() => {
    if (!project) return

    async function fetchAgents() {
      try {
        const res = await api.get(`/agents/${project._id}`)
        setAgents(res.data)
      } catch (e) {
        console.error("fetch agents error:", e)
      }
    }
    fetchAgents()
  }, [project])

  async function createAgent(e) {
    e.preventDefault()
    try {
      const payload = {
        name: agentForm.name,
        model: agentForm.model,
        prompt: { system: agentForm.promptText },
        projectId: id,
      }
      const res = await api.post('/agents', payload)
      setAgents(prev => [...prev, res.data])
      setAgentForm({ name: '', model: 'gpt-4o-mini', promptText: '' })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white px-6 py-10 pt-24 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {/* Project Info */}
        <h2 className="text-3xl font-bold text-yellow-600 mb-6">Project</h2>
        {project ? (
          <div className="bg-white/70 backdrop-blur-md border border-yellow-100 p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">
              {project.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{project.description}</p>
          </div>
        ) : (
          <div className="text-gray-500">Loading...</div>
        )}

        {/* Create Agent */}
        <section className="mt-10">
          <h3 className="text-2xl font-semibold text-yellow-600 mb-4">
            Create Agent
          </h3>
          <form
            onSubmit={createAgent}
            className="flex flex-col gap-3 bg-white/60 backdrop-blur-md border border-yellow-100 p-6 rounded-xl shadow-md max-w-lg"
          >
            <input
              value={agentForm.name}
              onChange={e =>
                setAgentForm({ ...agentForm, name: e.target.value })
              }
              placeholder="Agent name"
              className="border border-yellow-200 focus:border-yellow-400 focus:ring focus:ring-yellow-100 p-3 rounded-lg outline-none transition"
            />
            <input
              value={agentForm.model}
              onChange={e =>
                setAgentForm({ ...agentForm, model: e.target.value })
              }
              placeholder="Model"
              className="border border-yellow-200 focus:border-yellow-400 focus:ring focus:ring-yellow-100 p-3 rounded-lg outline-none transition"
            />
            <textarea
              value={agentForm.promptText}
              onChange={e =>
                setAgentForm({ ...agentForm, promptText: e.target.value })
              }
              placeholder="System prompt"
              className="border border-yellow-200 focus:border-yellow-400 focus:ring focus:ring-yellow-100 p-3 rounded-lg outline-none transition h-28 resize-none"
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg shadow-md transition transform hover:scale-[1.02]">
              Create Agent
            </button>
          </form>
        </section>

        {/* Agents List */}
        <section className="mt-10">
          <h4 className="text-xl font-semibold text-yellow-600 mb-4">Agents</h4>
          {agents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agents.map(a => (
                <div
                  key={a._id}
                  className="bg-white/70 backdrop-blur-lg border border-yellow-100 p-5 rounded-2xl shadow hover:shadow-lg transition transform hover:scale-[1.01]"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-lg text-gray-800">
                        {a.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Model: {a.model}
                      </div>
                    </div>
                    <Link
                      to={`/chat/${a._id}`}
                      className="text-sm font-medium text-yellow-600 hover:text-yellow-700 transition"
                    >
                      Chat →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No agents yet. Create one above ⚡</p>
          )}
        </section>
      </div>
    </div>
  )
}