import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { useRecoilState } from 'recoil'
import { projectsState } from '../state/atoms'
import { Link } from 'react-router-dom'

export default function Projects(){
  const [projects, setProjects] = useRecoilState(projectsState)
  const [form, setForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    fetchProjects()
  },[])

  async function fetchProjects(){
    try{
      const res = await api.get('/projects')
      setProjects(res.data)
    }catch(e){
      console.error(e)
    }
  }

  async function createProject(e){
    e.preventDefault()
    setLoading(true)
    try{
      const res = await api.post('/projects', form)
      setProjects(prev=>[...prev, res.data])
      setForm({ name: '', description: '' })
    }catch(e){
      console.error(e)
    }finally{ setLoading(false) }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Your Projects</h1>
      <form onSubmit={createProject} className="mb-4 flex gap-2">
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Project name" className="border p-2 rounded" />
        <input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" className="border p-2 rounded" />
        <button className="bg-green-600 text-white px-4 rounded" disabled={loading}>{loading? 'Creating...' : 'Create'}</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(p=> (
          <div key={p._id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-600">{p.description}</p>
            <div className="mt-3 flex gap-2">
              <Link to={`/projects/${p._id}`} className="text-sm text-blue-600">Open</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}