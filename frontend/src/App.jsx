import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Register from './pages/Register'
import Login from './pages/Login'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Chat from './pages/Chat'
import ProtectedRoute from './components/ProtectedRoute'
import api from './api/axios'
import { useSetRecoilState } from 'recoil'
import { userState } from './state/atoms'

export default function App() {
  const setUser = useSetRecoilState(userState)
  const nav = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true) 

  useEffect(() => {
    // Skip session validation on auth pages
    if (['/login', '/register'].includes(location.pathname)) {
      setLoading(false)
      return
    }

    async function checkSession() {
      try {
        const res = await api.get('/auth/me')
        if (res.data.user) {
          setUser(res.data.user)
          localStorage.setItem('user', JSON.stringify(res.data.user))
        } else {
          setUser(null)
          localStorage.removeItem('user')
          nav('/login')
        }
      } catch {
        setUser(null)
        localStorage.removeItem('user')
        nav('/login')
      } finally {
        setLoading(false)
      }
    }
    checkSession()
  }, [setUser, nav, location.pathname])

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div> // 👈 Render a loading state
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/projects" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
        <Route path="/chat/:agentId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}