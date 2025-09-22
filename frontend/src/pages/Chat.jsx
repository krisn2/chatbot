import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'

export default function Chat(){
  const { agentId } = useParams()
  const [msg, setMsg] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    // optionally fetch chat history from backend if available
  }, [agentId])

  async function sendMessage(e){
    e.preventDefault()
    if(!msg) return
    const localUserMessage = { role: 'user', content: msg }
    setMessages(prev=>[...prev, localUserMessage])
    setMsg('')
    setLoading(true)
    try{
      const res = await api.post(`/chat/${agentId}`, { msg })
      if(res.data.reply) {
        setMessages(prev=>[...prev, { role: 'agent', content: res.data.reply }])
      }
    }catch(e){
      console.error(e)
    }finally{ setLoading(false) }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl mb-4">Agent Chat</h2>
      <div className="bg-white p-4 rounded shadow h-96 overflow-auto mb-4 flex flex-col gap-3">
        {messages.map((m,i)=> (
          <div key={i} className={m.role === 'user' ? 'self-end bg-blue-100 p-2 rounded' : 'self-start bg-gray-100 p-2 rounded'}>
            <div className="text-sm">{m.content}</div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Type a message" className="flex-1 border p-2 rounded" />
        <button className="bg-blue-600 text-white px-4 rounded" disabled={loading}>{loading? 'Sending...':'Send'}</button>
      </form>
    </div>
  )
}