import ChatContainer from '../components/ChatContainer'
import NoChatContainer from '../components/NoChatContainer'
import SideBar from '../components/SideBar'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router'
import { 
  Briefcase, 
  MessageSquare, 
  Calendar, 
  FileText, 
  ListTodo, 
  HelpCircle, 
  LogOut,
  Home,
  Camera,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

const Chat = () => {
  const { selectedUser } = useChatStore()
  const { logout, authUser, updateAvatar, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      await updateAvatar(file)
    } catch (error) {
      // Handled in store
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully")
      navigate('/login')
    } catch (error) {
      toast.error("Logout failed")
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f4f6fc]">
      
      {/* Column 1: Far-Left Action Sidebar */}
      <aside className="w-20 border-r border-slate-200 bg-white flex flex-col items-center py-6 justify-between flex-shrink-0 z-10">
        
        {/* Top: App Logo Icon */}
        <div className="flex flex-col items-center gap-6">
          <div 
            onClick={() => navigate('/')}
            className="w-11 h-11 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-[#1e50ff] flex items-center justify-center cursor-pointer transition-all transform hover:scale-105"
            title="Go to Home"
          >
            <span className="text-xl font-black">L</span>
          </div>

          {/* Action List */}
          <nav className="flex flex-col gap-5 w-full px-2">
            
            {/* Homepage button */}
            <button 
              onClick={() => navigate('/')}
              className="flex flex-col items-center gap-1 py-1 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="text-[9px] font-semibold">Home</span>
            </button>

            {/* Offers button */}
            <button className="flex flex-col items-center gap-1 py-1 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
              <Briefcase className="w-5 h-5" />
              <span className="text-[9px] font-semibold">Offers</span>
            </button>

            {/* Chat button (Active) */}
            <button className="flex flex-col items-center gap-1 py-2 text-white bg-[#1e50ff] rounded-xl shadow-md shadow-blue-500/20 cursor-pointer transition-all">
              <MessageSquare className="w-5 h-5" />
              <span className="text-[9px] font-bold">Chat</span>
            </button>

            {/* Event button */}
            <button className="flex flex-col items-center gap-1 py-1 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
              <Calendar className="w-5 h-5" />
              <span className="text-[9px] font-semibold">Event</span>
            </button>

            {/* Applications button */}
            <button className="flex flex-col items-center gap-1 py-1 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
              <FileText className="w-5 h-5" />
              <span className="text-[9px] font-semibold">Apps</span>
            </button>

            {/* Lists button */}
            <button className="flex flex-col items-center gap-1 py-1 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
              <ListTodo className="w-5 h-5" />
              <span className="text-[9px] font-semibold">Lists</span>
            </button>

            {/* FAQ button */}
            <button className="flex flex-col items-center gap-1 py-1 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
              <HelpCircle className="w-5 h-5" />
              <span className="text-[9px] font-semibold">FAQ</span>
            </button>

          </nav>
        </div>

        {/* Bottom Actions: User Profile & Logout */}
        <div className="flex flex-col items-center gap-4">
          {authUser && (
            <div className="relative group">
              <label 
                htmlFor="avatar-upload" 
                className={`block relative w-11 h-11 rounded-full cursor-pointer overflow-hidden border border-slate-200 shadow-sm transition-all hover:scale-105 ${isLoading ? "pointer-events-none" : ""}`}
                title="Change Avatar"
              >
                <img 
                  src={authUser.avatar || "/avatar.webp"} 
                  alt={authUser.username} 
                  className="w-full h-full object-cover"
                />
                
                {/* Hover overlay with Camera icon */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-4 h-4 text-white" />
                </div>

                {/* Loading spinner overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-black/65 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                )}
              </label>
              <input 
                type="file" 
                id="avatar-upload" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarChange}
                disabled={isLoading}
              />
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="w-10 h-10 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl flex items-center justify-center transition-all cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

      </aside>

      {/* Column 2: Center Main Message Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[#f1f5f9] relative">
        {selectedUser ? <ChatContainer /> : <NoChatContainer />}
      </main>

      {/* Column 3: Right Sidebar Contacts */}
      <SideBar />

    </div>
  )
}

export default Chat