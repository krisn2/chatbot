import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { userState } from '../state/atoms'
import { login } from '../utils/auth'

export default function Login(){
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const setUser = useSetRecoilState(userState)
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError(null)
    try{
      const res = await login(form)
      // backend sets cookie — optionally returns user
      if(res.data.user) setUser(res.data.user)
      // fetch projects page
      nav('/projects')
    }catch(err){
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="border p-2 rounded" />
        <input value={form.password} onChange={e=>setForm({...form,password:e.target.value})} type="password" placeholder="Password" className="border p-2 rounded" />
        {error && <div className="text-red-500">{error}</div>}
        <button className="bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  )
}