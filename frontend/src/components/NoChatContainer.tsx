import { MessageSquare, ArrowRight } from 'lucide-react'

const NoChatContainer = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 h-full p-6 text-center select-none relative overflow-hidden">
      {/* Decorative subtle backgrounds */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1e50ff]/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center max-w-sm">
        
        {/* Animated Icon Container */}
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6 shadow-sm animate-bounce [animation-duration:3s]">
          <MessageSquare className="w-8 h-8 text-[#1e50ff]" />
        </div>

        {/* Heading */}
        <h3 className="text-xl font-extrabold text-slate-800 tracking-tight mb-2.5">
          Select a conversation
        </h3>
        
        {/* Subtext */}
        <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
          Choose a contact from the list on the right to start messaging, share files, and view their details.
        </p>

        {/* Decorative guide */}
        <div className="flex items-center gap-2 text-xs text-[#1e50ff] font-bold bg-blue-50/50 border border-blue-100/50 px-4 py-2 rounded-full">
          <span>Browse contacts</span>
          <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
        </div>

      </div>
    </div>
  )
}

export default NoChatContainer