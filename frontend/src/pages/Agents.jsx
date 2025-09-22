import React, { useEffect } from 'react'
import api from '../api/axios'
import { useRecoilState } from 'recoil'
import { agentsState } from '../state/atoms'

export default function Agents(){
  const [agents, setAgents] = useRecoilState(agentsState)

  useEffect(()=>{
    api.get('/agents').then(res=> setAgents(res.data)).catch(console.error)
  },[])

  return (
    <div className="p-6">
      <h1 className="text-2xl">Agents</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {agents.map(a=> (
          <div key={a._id} className="bg-white p-4 rounded shadow">
            <div className="font-semibold">{a.name}</div>
            <div className="text-sm">Model: {a.model}</div>
          </div>
        ))}
      </div>
    </div>
  )
}