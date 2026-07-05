import React, { useEffect } from 'react'
import CustomizedInput from '../components/CustomizedInput'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'
import { useAuthStore } from '../store/useAuthStore.ts'
import { Mail, Lock, User, UserPlus, MessageSquare } from 'lucide-react'

const Signup = () => {
  const navigate = useNavigate()
  const { isLoggedIn, signup, isLoading } = useAuthStore()

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/chat')
    }
  }, [isLoggedIn, navigate])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const username = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!username || !email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    const toastId = toast.loading("Signing Up")

    try {
      await signup(username, email, password)
      toast.success("Account created successfully!", { id: toastId })
      navigate('/chat')
    } catch (error: any) {
      console.log(error)
      toast.error(
        error?.response?.data?.message || "Signing Up Failed",
        { id: toastId }
      )
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4 py-16 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Logo and Greeting */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-300 mt-2 text-center">
            Get started with chatapp in seconds
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Username
            </label>
            <CustomizedInput
              type="text"
              name="name"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Email Address
            </label>
            <CustomizedInput
              type="email"
              name="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Password
            </label>
            <CustomizedInput
              type="password"
              name="password"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 mt-4 text-sm"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center border-t border-white/5 pt-6 text-xs text-slate-400 flex items-center justify-center gap-2">
          Already have an account?
          <button 
            onClick={() => navigate('/login')}
            className="text-blue-400 hover:text-blue-300 font-bold transition-colors cursor-pointer hover:underline"
          >
            Log In
          </button>
        </div>

      </div>
    </div>
  )
}

export default Signup