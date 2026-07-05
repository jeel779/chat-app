import { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import MessageInput from './MessageInput'
import { Phone, Mail, X, ChevronRight } from 'lucide-react'

const ChatContainer = () => {
  const { getMessages, selectedUser, messages, isMessagesLoading, setSelectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore()
  const { authUser, onlineUsers } = useAuthStore()
  const messageEndRef = useRef<HTMLDivElement>(null)

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser.id)
    }

  }, [selectedUser, getMessages])
  useEffect(() => {
    if (!selectedUser) return;

    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser]);
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 h-full">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 mt-2 font-medium">Loading conversation...</p>
      </div>
    )
  }

  // Format date helper
  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
    } catch {
      return dateStr
    }
  }


  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">

      {/* 1. Top Blue Header (Mockup from Image 1) */}
      <div className="bg-[#1e50ff] px-6 py-4 flex items-center justify-between text-white flex-shrink-0">
        <h3 className="text-base font-bold tracking-tight">Homepage</h3>

        {authUser && (
          <div className="flex items-center gap-2 cursor-pointer group">
            <img
              src={authUser.avatar || "/avatar.webp"}
              alt={authUser.username}
              className="w-8 h-8 object-cover rounded-full border border-white/20"
            />
            <span className="text-sm font-bold text-white/90 group-hover:text-white transition-colors">
              {authUser.username}
            </span>
            <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          </div>
        )}
      </div>

      {/* 2. Sub-header with Active User Info (Mockup from Image 1) */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={selectedUser?.avatar || "/avatar.webp"}
              alt={selectedUser?.username}
              className="w-10 h-10 object-cover rounded-full border border-slate-100"
            />
            {selectedUser && onlineUsers.includes(selectedUser.id) && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white bg-emerald-500" />
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 leading-tight">
              {selectedUser?.username}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <button className="text-slate-400 hover:text-[#1e50ff] p-0.5 rounded transition-colors cursor-pointer">
                <Phone className="w-3.5 h-3.5" />
              </button>
              <button className="text-slate-400 hover:text-[#1e50ff] p-0.5 rounded transition-colors cursor-pointer">
                <Mail className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>


        {/* Close button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-1.5 rounded-full border border-slate-200 transition-all cursor-pointer"
          title="Close conversation"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Messages Workspace */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
            <p className="text-sm font-semibold">No messages yet</p>
            <p className="text-xs">Send a message to start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.senderId === authUser?.id
            return (
              <div
                key={message.id}
                className={`flex items-end gap-3 max-w-[85%] sm:max-w-[70%] 
                  ${isMe ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatar */}
                <img
                  src={isMe ? authUser?.avatar || "/avatar.webp" : selectedUser?.avatar || "/avatar.webp"}
                  alt="avatar"
                  className="w-8 h-8 object-cover rounded-full border border-slate-200/80 flex-shrink-0"
                />

                {/* Message Body with timestamp on outer edge */}
                <div className={`flex items-center gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm leading-relaxed flex flex-col gap-2
                      ${isMe
                        ? "bg-[#4b5563] text-white rounded-tr-none"
                        : "bg-[#1e50ff] text-white rounded-tl-none"
                      }
                    `}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Uploaded attachment"
                        className="rounded-lg max-w-[240px] max-h-[240px] md:max-w-[320px] md:max-h-[320px] object-cover cursor-pointer hover:opacity-90 transition-opacity border border-white/10"
                        onClick={() => window.open(message.image!, '_blank')}
                      />
                    )}
                    {message.content && (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 font-bold select-none whitespace-nowrap self-end mb-1">
                    {formatTime(message.createdAt)}
                  </span>
                </div>
              </div>
            )
          })
        )}

        {/* Mock typing indicator matching Hilda Hansen mockup in Image 1 */}
        {selectedUser?.username === "Hilda Hansen" && messages.length > 0 && (
          <div className="flex items-end gap-3 mr-auto max-w-[70%]">
            <img
              src={selectedUser?.avatar || "/avatar.webp"}
              alt="avatar"
              className="w-8 h-8 object-cover rounded-full border border-slate-200/80 flex-shrink-0"
            />
            <div className="bg-slate-200/70 border border-slate-300/40 backdrop-blur px-5 py-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1 text-slate-500">
              <div className="dot-bounce bg-slate-500 animate-bounce-delay-100"></div>
              <div className="dot-bounce bg-slate-500 animate-bounce-delay-200"></div>
              <div className="dot-bounce bg-slate-500 animate-bounce-delay-300"></div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messageEndRef} />
      </div>

      {/* 4. Bottom Message Input Bar */}
      <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0">
        <MessageInput />
      </div>

    </div>
  )
}

export default ChatContainer