import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { userState } from '../state/atoms'
import api from '../api/axios'

export default function Navbar() {
  const [user, setUser] = useRecoilState(userState)
  const nav = useNavigate()

  async function logout() {
    try {
      await api.post('/auth/logout')
    } catch (e) {
      /* ignore */
    }
    setUser(null)
    nav('/login')
  }

  return (
    <div className="fixed top-3 left-0 w-full z-50 flex justify-center px-4">
      <nav className="w-full max-w-4xl backdrop-blur-lg bg-white/40 border border-white/30 rounded-2xl shadow-md px-6 py-3 flex justify-between items-center font-[Poppins]">
        {/* Left: Brand + Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="font-bold text-xl text-yellow-600 hover:text-yellow-700 transition"
          >
            Chat App
          </Link>
          <Link
            to="/projects"
            className="text-sm text-gray-700 hover:text-yellow-600 transition"
          >
            Projects
          </Link>
        </div>

        {/* Right: Auth */}
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-800">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-lg shadow-sm transition transform hover:scale-[1.03]"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-yellow-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-gray-700 hover:text-yellow-600 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}
