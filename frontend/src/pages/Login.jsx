import React, { useState } from 'react'
import { useNavigate , Link} from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { userState } from '../state/atoms'
import { login } from '../utils/auth'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const setUser = useSetRecoilState(userState)
  const nav = useNavigate()

 async function submit(e) {
  e.preventDefault()
  setError(null)
  try {
    const res = await login(form)
    if (res.data.user) {
      setUser(res.data.user)              
      localStorage.setItem('user', JSON.stringify(res.data.user)) 
    }
    nav('/projects')
  } catch (err) {
    setError(err?.response?.data?.message || 'Login failed')
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white px-4">
      <div className="w-full max-w-md bg-white border border-yellow-200 shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-yellow-600 mb-6">
          Welcome Back
        </h2>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="border border-yellow-200 focus:border-yellow-400 focus:ring focus:ring-yellow-100 p-3 rounded-lg outline-none transition"
          />
          <input
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            type="password"
            placeholder="Password"
            className="border border-yellow-200 focus:border-yellow-400 focus:ring focus:ring-yellow-100 p-3 rounded-lg outline-none transition"
          />
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg shadow-md transition transform hover:scale-[1.02]"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-6">
          Don’t have an account?{' '}
          <span className="text-yellow-600 hover:underline cursor-pointer">
          <Link to='/register'>
            Sign Up
          </Link>
          </span>
        </p>
      </div>
    </div>
  )
}
