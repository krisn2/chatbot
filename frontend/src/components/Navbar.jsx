import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { userState } from '../state/atoms'
import api from '../api/axios'

export default function Navbar(){
  const [user, setUser] = useRecoilState(userState)
  const nav = useNavigate()

  async function logout(){
    try{
      await api.post('/auth/logout')
    }catch(e){/* ignore */}
    setUser(null)
    nav('/login')
  }

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg">Chat app</Link>
        <Link to="/projects" className="text-sm">Projects</Link>
      </div>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">{user.name}</span>
            <button onClick={logout} className="text-sm bg-red-500 text-white px-3 py-1 rounded">Logout</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="text-sm">Login</Link>
            <Link to="/register" className="text-sm">Register</Link>
          </div>
        )}
      </div>
    </nav>
  )
}