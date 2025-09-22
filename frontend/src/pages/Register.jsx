import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { userState } from '../state/atoms'
import { register } from '../utils/auth'

export default function Register(){
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const setUser = useSetRecoilState(userState)
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError(null)
    try{
      const res = await register(form)
      // if backend returns user data
      if(res.data.user) setUser(res.data.user)
      nav('/projects')
    }catch(err){
      setError(err?.response?.data?.message || 'Register failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Register</h2>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="border p-2 rounded" />
        <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="border p-2 rounded" />
        <input value={form.password} onChange={e=>setForm({...form,password:e.target.value})} type="password" placeholder="Password" className="border p-2 rounded" />
        {error && <div className="text-red-500">{error}</div>}
        <button className="bg-blue-600 text-white py-2 rounded">Register</button>
      </form>
    </div>
  )
}