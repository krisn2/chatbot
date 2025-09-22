import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { useRecoilState } from 'recoil'
import { projectsState } from '../state/atoms'
import { Link } from 'react-router-dom'

export default function Projects() {
  const [projects, setProjects] = useRecoilState(projectsState)
  const [form, setForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      const res = await api.get('/projects')
      setProjects(res.data)
    } catch (e) {
      console.error(e)
    }
  }

  async function createProject(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/projects', form)
      setProjects(prev => [...prev, res.data])
      setForm({ name: '', description: '' })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white px-6 py-10 pt-24 flex flex-col items-center">
    <div className="w-full max-w-4xl">
        {/* Title */}
        <h1 className="text-3xl font-bold text-yellow-600 mb-6">Your Projects</h1>

        {/* Create Form */}
        <form
          onSubmit={createProject}
          className="mb-8 flex flex-col md:flex-row gap-3 bg-white/60 backdrop-blur-md border border-yellow-100 rounded-xl shadow p-4"
        >
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Project name"
            className="flex-1 border border-yellow-200 focus:border-yellow-400 focus:ring focus:ring-yellow-100 p-3 rounded-lg outline-none transition"
          />
          <input
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            className="flex-1 border border-yellow-200 focus:border-yellow-400 focus:ring focus:ring-yellow-100 p-3 rounded-lg outline-none transition"
          />
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded-lg shadow transition transform hover:scale-[1.02]"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(p => (
            <div
              key={p._id}
              className="bg-white/70 backdrop-blur-lg border border-yellow-100 p-6 rounded-2xl shadow hover:shadow-md transition transform hover:scale-[1.01]"
            >
              <h3 className="font-semibold text-lg text-gray-800">{p.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{p.description}</p>
              <div className="mt-4">
                <Link
                  to={`/projects/${p._id}`}
                  className="text-sm font-medium text-yellow-600 hover:text-yellow-700 transition"
                >
                  Open →
                </Link>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <p className="text-center text-gray-500 col-span-2">
              No projects yet. Create one above 🚀
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
