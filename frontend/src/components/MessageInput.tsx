import React, { useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import { Send } from 'lucide-react'

const MessageInput = () => {
  const [message, setMessage] = useState('')
  const { sendMessage } = useChatStore()
  const { authUser } = useAuthStore()

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    try {
      await sendMessage(message.trim())
      setMessage('')
    } catch (error) {
      // Error toast is handled inside store
    }
  }

  return (
    <form onSubmit={handleSend} className="flex items-center gap-4 w-full">
      {/* Search/Message bar */}
      <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-full px-5 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#1e50ff] focus-within:border-transparent focus-within:bg-white transition-all">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type something"
          className="flex-1 bg-transparent border-none outline-none py-1 text-sm text-slate-800 placeholder-slate-400 font-medium"
        />
        
        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim()}
          className="flex items-center justify-center p-2 rounded-full bg-[#1e50ff] text-white hover:bg-blue-600 disabled:opacity-40 disabled:hover:bg-[#1e50ff] transition-all cursor-pointer shadow hover:scale-105 active:scale-95"
        >
          <Send className="w-3.5 h-3.5 transform rotate-0" />
        </button>
      </div>

      {/* User Avatar next to input bar */}
      {authUser && (
        <img
          src={authUser.avatar || "/avatar.webp"}
          alt={authUser.username}
          className="w-10 h-10 object-cover rounded-full border border-slate-200 shadow-sm flex-shrink-0"
        />
      )}
    </form>
  )
}

export default MessageInput