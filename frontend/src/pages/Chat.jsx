import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'

// Simple markdown parser function
function parseMarkdown(text) {
  if (!text) return text

  let html = text
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mb-2 mt-4">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-2 mt-4">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-3 mt-4">$1</h1>')
    
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-lg overflow-x-auto my-3"><code class="text-sm font-mono">$2</code></pre>')
    
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
    
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    
    // Italic
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    
    // Unordered lists
    .replace(/^\* (.*$)/gm, '<li class="ml-4">• $1</li>')
    .replace(/(<li class="ml-4">• .*<\/li>)/gs, '<ul class="my-2">$1</ul>')
    
    // Numbered lists
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/(<li class="ml-4 list-decimal">.*<\/li>)/gs, '<ol class="my-2 ml-4">$1</ol>')
    
    // Line breaks
    .replace(/\n/g, '<br />')

  return html
}

// Message component to handle rendering
function MessageBubble({ message }) {
  if (message.role === 'user') {
    return (
      <div className="mb-3 p-3 rounded-xl max-w-[80%] bg-yellow-200 self-end text-gray-800 ml-auto">
        {message.content}
      </div>
    )
  }

  return (
    <div className="mb-3 p-3 rounded-xl max-w-[80%] bg-white/80 text-gray-700">
      <div 
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ 
          __html: parseMarkdown(message.content) 
        }}
      />
    </div>
  )
}

export default function Chat() {
  const { agentId } = useParams()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const chatEndRef = useRef(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

useEffect(() => {
    async function fetchChat() {
      try {
        // Now it fetches a single chat directly by its agentId
        const res = await api.get(`/chat/${agentId}`) 
        setMessages(res.data.messages);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setMessages([]); // Set to empty array if no chat is found
        setLoading(false);
      }
    }
    fetchChat();
}, [agentId]);

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim()) return

    const msg = input.trim()
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setInput('')

    try {
      const res = await api.post(`/chat/${agentId}`, { msg })
      const reply = res.data.reply
      setMessages(prev => [...prev, { role: 'agent', content: reply }])
    } catch (e) {
      console.error(e)
      setMessages(prev => [...prev, { role: 'agent', content: 'Error: could not send message' }])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white px-6 py-10 pt-24 flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-yellow-600 mb-6">Chat</h2>

        <div className="bg-white/70 backdrop-blur-md border border-yellow-100 p-6 rounded-2xl shadow-md flex-1 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <p className="text-gray-500">Loading chat...</p>
          ) : messages.length === 0 ? (
            <p className="text-gray-500">No messages yet. Say hi! 👋</p>
          ) : (
            <div className="flex flex-col">
              {messages.map((m, idx) => (
                <MessageBubble key={idx} message={m} />
              ))}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={sendMessage} className="flex gap-3 mt-4">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-yellow-200 focus:border-yellow-400 focus:ring focus:ring-yellow-100 p-3 rounded-lg outline-none transition"
          />
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition transform hover:scale-[1.02]">
            Send
          </button>
        </form>
      </div>
    </div>
  )
}