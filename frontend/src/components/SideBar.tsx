import { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import { Search } from 'lucide-react'

// Mock sub-info and time to match Image 1
const mockUserInfo: { [key: string]: { sub: string; time: string } } = {
  "Ricardo Lopez": { sub: "Three Ways To Get Travel Disco...", time: "11:23 am" },
  "Frederick Byrd": { sub: "Travel Travel On Track For Safety", time: "10:11 am" },
  "Hilda Hansen": { sub: "Become A Travel Pro In One Easy...", time: "08:43 am" },
  "Ryan Underwood": { sub: "How To Maintain Your Mental Real...", time: "7:11 am" },
  "Myrtie Diaz": { sub: "Get Ready Fast For Fall Leaf View...", time: "Yesterday" },
  "Steve Fowler": { sub: "Three Ways To Get Travel Disco...", time: "Yesterday" },
}

const SideBar = () => {
  const { getUsers, users, isUsersLoading, selectedUser, setSelectedUser } = useChatStore()
  const { onlineUsers, authUser } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)

  useEffect(() => {
    getUsers()
  }, [getUsers])

  if (isUsersLoading) {
    return (
      <div className="w-80 flex-shrink-0 border-l border-slate-200 bg-white flex flex-col items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 mt-2 font-medium">Loading contacts...</p>
      </div>
    )
  }

  // Filter users based on search query and online status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesOnline = !showOnlineOnly || onlineUsers.includes(user.id)
    return matchesSearch && matchesOnline
  })

  return (
    <div className="w-80 flex-shrink-0 border-l border-slate-200 bg-white flex flex-col h-full shadow-sm">
      

      {/* Search Input */}
      <div className="p-4 border-b border-slate-100 flex flex-col gap-2">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="search messages"
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Show Online Only Toggle */}
        <div className="flex items-center justify-between px-1 mt-1">
          <label className="cursor-pointer flex items-center gap-2 text-xs text-slate-500 font-semibold select-none">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="rounded border-slate-300 text-[#1e50ff] focus:ring-[#1e50ff] w-3.5 h-3.5 cursor-pointer"
            />
            <span>Show online only</span>
          </label>
          <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded-full">
            {onlineUsers.filter(id => id !== authUser?.id).length} online
          </span>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
        {filteredUsers.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 font-medium">
            No contacts found
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isSelected = selectedUser?.id === user.id
            const isOnline = onlineUsers.includes(user.id)
            // Get mock data or fallback values
            const details = mockUserInfo[user.username] || { 
              sub: "Click to start chatting", 
              time: "Just now", 
              company: "Guest" 
            }

            return (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full px-4 py-4 flex items-start gap-3.5 transition-all text-left border-l-4 cursor-pointer
                  ${isSelected 
                    ? "bg-[#1e50ff] text-white border-l-white" 
                    : "hover:bg-slate-50 text-slate-800 border-l-transparent"
                  }
                `}
              >
                {/* Avatar with Status indicator */}
                <div className="relative flex-shrink-0 mt-0.5">
                  <img
                    src={user.avatar || "/avatar.webp"}
                    alt={user.username}
                    className={`w-11 h-11 object-cover rounded-full border-2 
                      ${isSelected ? "border-white/50" : "border-slate-100"}`}
                  />
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 
                    ${isOnline 
                      ? (isSelected ? "ring-[#1e50ff] bg-emerald-400" : "ring-white bg-emerald-500") 
                      : (isSelected ? "ring-[#1e50ff] bg-slate-400" : "ring-white bg-slate-300")
                    }`}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-bold truncate ${isSelected ? "text-white" : "text-slate-800"}`}>
                      {user.username}
                    </h4>
                    <span className={`text-[10px] whitespace-nowrap font-medium ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                      {details.time}
                    </span>
                  </div>
                  
                  
                  <p className={`text-xs truncate ${isSelected ? "text-blue-100/90" : "text-slate-500"}`}>
                    {details.sub}
                  </p>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

export default SideBar