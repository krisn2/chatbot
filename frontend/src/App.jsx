import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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

export default function App(){
  const setUser = useSetRecoilState(userState)

  useEffect(()=>{
    // Try to fetch a /auth/me endpoint if available to get current user
    api.get('/auth/me').then(res=>{
      setUser(res.data.user)
    }).catch(()=>{
      setUser(null)
    })
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/projects" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
        <Route path="/agents" element={<ProtectedRoute><Navigate to="/projects" replace /></ProtectedRoute>} />
        <Route path="/chat/:agentId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}