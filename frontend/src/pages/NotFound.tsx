const NotFound = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-6">
      <h1 className="text-4xl font-extrabold mb-2 text-slate-900">404</h1>
      <p className="text-sm font-semibold text-slate-500 mb-4">Page Not Found</p>
      <a href="/" className="text-sm font-bold text-[#1e50ff] hover:underline">
        Go back home
      </a>
    </div>
  )
}

export default NotFound