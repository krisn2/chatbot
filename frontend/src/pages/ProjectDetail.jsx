import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'

export default function ProjectDetail(){
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [agentForm, setAgentForm] = useState({ name: '', model: 'gpt-4o-mini', promptText: '' })
  const [agents, setAgents] = useState([])

  useEffect(()=>{ fetchProject() ; fetchAgents() }, [])

  async function fetchProject(){
    try{
      const res = await api.get('/projects')
      const p = res.data.find(x=> x._id === id)
      setProject(p)
    }catch(e){ console.error(e) }
  }

  async function fetchAgents(){
    try{
      // if your backend has /agents?projectId=...
      const res = await api.get('/agents')
      setAgents(res.data.filter(a=>a.projectId === id))
    }catch(e){ console.error(e) }
  }

  async function createAgent(e){
    e.preventDefault()
    try{
      const payload = { name: agentForm.name, model: agentForm.model, prompt: { system: agentForm.promptText }, projectId: id }
      const res = await api.post('/agents', payload)
      setAgents(prev=>[...prev, res.data])
      setAgentForm({ name: '', model: 'gpt-4o-mini', promptText: '' })
    }catch(e){ console.error(e) }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Project</h2>
      {project ? (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg">{project.name}</h3>
          <p className="text-sm text-gray-600">{project.description}</p>
        </div>
      ) : <div>Loading...</div>}

      <section className="mt-6">
        <h3 className="text-lg mb-2">Create Agent</h3>
        <form onSubmit={createAgent} className="flex flex-col gap-2 max-w-md">
          <input value={agentForm.name} onChange={e=>setAgentForm({...agentForm,name:e.target.value})} placeholder="Agent name" className="border p-2 rounded" />
          <input value={agentForm.model} onChange={e=>setAgentForm({...agentForm,model:e.target.value})} placeholder="Model" className="border p-2 rounded" />
          <textarea value={agentForm.promptText} onChange={e=>setAgentForm({...agentForm,promptText:e.target.value})} placeholder="System prompt" className="border p-2 rounded" />
          <button className="bg-indigo-600 text-white py-2 rounded">Create Agent</button>
        </form>

        <div className="mt-4">
          <h4 className="font-semibold">Agents</h4>
          <ul>
            {agents.map(a=> (
              <li key={a._id} className="py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-sm text-gray-500">Model: {a.model}</div>
                  </div>
                  <Link to={`/chat/${a._id}`} className="text-blue-600">Chat</Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}