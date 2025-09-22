import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Chat() {
  const { agentId } = useParams()
  const [msg, setMsg] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)
  const abortControllerRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  async function sendMessage(e) {
    e.preventDefault()
    if (!msg.trim()) return
    
    // Clear any previous errors
    setError('')
    
    const localUserMessage = { role: 'user', content: msg.trim() }
    setMessages(prev => [...prev, localUserMessage])
    setMsg('')
    setLoading(true)

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      const res = await api.post(`/chat/${agentId}`, 
        { msg: msg.trim() },
        { signal: abortControllerRef.current.signal }
      )
      
      if (res.data?.reply) {
        setMessages(prev => [...prev, { role: 'agent', content: res.data.reply }])
      } else {
        throw new Error('No reply received from agent')
      }
    } catch (err) {
      console.error(err)
      
      // Don't show error for aborted requests
      if (err.name !== 'AbortError') {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to send message'
        setError(errorMessage)
        
        // Add error message to chat
        setMessages(prev => [...prev, { 
          role: 'system', 
          content: `Error: ${errorMessage}` 
        }])
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }

  // Validate agentId exists
  if (!agentId) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: No agent ID provided
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl mb-4">Agent Chat - {agentId}</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            onClick={() => setError('')}
            className="float-right text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="bg-white p-4 rounded shadow h-96 overflow-auto mb-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="text-gray-500 text-center py-8">
            Start a conversation with the agent...
          </div>
        )}
        
        {messages.map((m, i) => (
          <div
            key={i}
            className={`${
              m.role === 'user'
                ? 'self-end bg-blue-100 p-2 rounded max-w-[80%]'
                : m.role === 'system'
                ? 'self-center bg-red-100 p-2 rounded max-w-[90%] text-center'
                : 'self-start bg-gray-100 p-2 rounded max-w-[80%]'
            }`}
          >
            {m.role === 'agent' ? (
              <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    p: ({node, ...props}) => <p className="prose prose-sm max-w-none" {...props} />,
    code: ({node, ...props}) => (
      <code className="bg-gray-200 rounded px-1" {...props} />
    ),
    ul: ({node, ...props}) => <ul className="list-disc pl-5" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal pl-5" {...props} />,
    a: ({node, ...props}) => (
      <a className="text-blue-600 underline" target="_blank" rel="noreferrer" {...props} />
    ),
  }}
>
  {m.content}
</ReactMarkdown>

            ) : (
              <div className="text-sm whitespace-pre-wrap">{m.content}</div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="self-start bg-gray-100 p-2 rounded max-w-[80%]">
            <div className="text-sm text-gray-500">Agent is typing...</div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          maxLength={1000} // Add reasonable limit
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !msg.trim()}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}