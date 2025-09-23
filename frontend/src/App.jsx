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
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { userState } from './state/atoms'

export default function App() {
  const setUser = useSetRecoilState(userState)
  const user = useRecoilValue(userState) // Get the current user state
  const nav = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)

 useEffect(() => {
    // Check session on every app load unless on login/register pages
    async function checkSession() {
      try {
        const res = await api.get('/auth/me');
        if (res.data.user) {
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        } else {
          setUser(null);
          localStorage.removeItem('user');
          // No navigation needed here, ProtectedRoute will handle it
        }
      } catch {
        setUser(null);
        localStorage.removeItem('user');
        // No navigation needed here
      } finally {
        setLoading(false);
      }
    }

    // Only check if the user is not in state and not on login/register pages
    if (!user && !['/login', '/register'].includes(location.pathname)) {
        checkSession();
    } else {
        setLoading(false);
    }

  }, [setUser, nav, location.pathname, user]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>
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