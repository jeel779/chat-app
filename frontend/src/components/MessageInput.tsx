import React, { useState, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import { Send, Image, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const MessageInput = () => {
  const [message, setMessage] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { sendMessage } = useChatStore()
  const { authUser } = useAuthStore()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    setImage(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() && !image) return

    setIsSending(true)
    try {
      await sendMessage(message.trim(), image)
      setMessage('')
      removeImage()
    } catch (error) {
      // Error toast handled inside store
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Image Preview Container */}
      {imagePreview && (
        <div className="flex items-center gap-2 pb-2 pl-2">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shadow-sm group">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-full object-cover" 
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-all cursor-pointer"
              title="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-center gap-3 w-full">
        {/* Attachment buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
            className={`flex items-center justify-center p-2.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer ${imagePreview ? "text-blue-600 bg-blue-50" : ""}`}
            title="Attach image"
          >
            <Image className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
            disabled={isSending}
          />
        </div>

        {/* Message Input bar */}
        <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-full px-5 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#1e50ff] focus-within:border-transparent focus-within:bg-white transition-all">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={image ? "Add a caption..." : "Type something"}
            className="flex-1 bg-transparent border-none outline-none py-1 text-sm text-slate-800 placeholder-slate-400 font-medium"
            disabled={isSending}
          />
          
          {/* Send / Loading Button */}
          <button
            type="submit"
            disabled={(!message.trim() && !image) || isSending}
            className="flex items-center justify-center p-2 rounded-full bg-[#1e50ff] text-white hover:bg-blue-600 disabled:opacity-40 disabled:hover:bg-[#1e50ff] transition-all cursor-pointer shadow hover:scale-105 active:scale-95"
          >
            {isSending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
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
    </div>
  )
}

export default MessageInput