import React from 'react'
import { Navigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { userState } from '../state/atoms'

export default function ProtectedRoute({ children }){
  const user = useRecoilValue(userState)
  if(!user) return <Navigate to="/login" replace />
  return children
}