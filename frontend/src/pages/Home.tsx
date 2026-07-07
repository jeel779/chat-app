import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#1e50ff] text-white flex flex-col overflow-hidden relative">
      {/* Background decorative circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

      {/* Landing Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-2xl font-extrabold tracking-tight">chatty</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          <a href="#product" className="hover:text-white transition-colors">Product</a>
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={() => navigate('/chat')}
              className="bg-white text-[#1e50ff] hover:bg-slate-100 px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              Go to Workspace
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="hover:text-white text-white/80 text-sm font-bold px-4 py-2 cursor-pointer transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-white text-[#1e50ff] hover:bg-slate-100 px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                Try it Free
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Content */}
        <div className="flex flex-col items-start max-w-xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Have your<br />best chat
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium mb-10 leading-relaxed max-w-md">
            Fast, easy & unlimited team chat.
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            {isLoggedIn ? (
              <button
                onClick={() => navigate('/chat')}
                className="bg-white text-[#1e50ff] hover:bg-slate-100 px-8 py-4 rounded-full text-base font-bold shadow-lg shadow-blue-800/30 hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer text-center"
              >
                Open Chat Workspace
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-white text-[#1e50ff] hover:bg-slate-100 px-8 py-4 rounded-full text-base font-bold shadow-lg shadow-blue-800/30 hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer text-center"
                >
                  Try it Free
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="border-2 border-white/40 hover:border-white/80 hover:bg-white/10 text-white px-8 py-4 rounded-full text-base font-bold transition-all transform hover:-translate-y-0.5 cursor-pointer text-center"
                >
                  Get a Demo
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Media (Mockup) */}
        <div className="relative w-full max-w-md mx-auto lg:max-w-none lg:h-[550px] flex items-center justify-center">
          
          {/* Dot patterns */}
          <div className="absolute top-[10%] left-[-5%] w-24 h-24 grid grid-cols-6 gap-2 opacity-60">
            {Array.from({ length: 36 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
            ))}
          </div>
          <div className="absolute bottom-[15%] right-[5%] w-24 h-24 grid grid-cols-6 gap-2 opacity-60">
            {Array.from({ length: 36 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
            ))}
          </div>

          {/* Collage Frame */}
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* Image 1 (Top Left Portrait) */}
            <div className="absolute top-[5%] left-[5%] w-[60%] aspect-[4/5] rounded-[2rem] overflow-hidden border-[6px] border-[#1e50ff] shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500 z-10">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=500" 
                alt="Smiling team member" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image 2 (Bottom Right Portrait) */}
            <div className="absolute bottom-[5%] right-[5%] w-[55%] aspect-[4/5] rounded-[2rem] overflow-hidden border-[6px] border-[#1e50ff] shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 z-10">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500" 
                alt="Smiling team member" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bubble 1 (Orange Chat Bubble) */}
            <div className="absolute top-[25%] right-[-5%] z-20 bg-amber-500 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl rounded-bl-none shadow-xl flex items-center gap-2 transform translate-x-2">
              <div className="w-5 h-5 rounded-full overflow-hidden border border-white/40">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" className="object-cover w-full h-full" alt="User avatar" />
              </div>
              <span>Hi darling, how's the report?</span>
            </div>

            {/* Bubble 2 (Glassmorphism Typing Bubble) */}
            <div className="absolute bottom-[40%] left-[-5%] z-20 bg-white/10 border border-white/20 backdrop-blur-md px-5 py-3 rounded-2xl rounded-tr-none shadow-xl flex items-center gap-1">
              <div className="dot-bounce bg-white animate-bounce-delay-100"></div>
              <div className="dot-bounce bg-white animate-bounce-delay-200"></div>
              <div className="dot-bounce bg-white animate-bounce-delay-300"></div>
            </div>

            {/* Bubble 3 (Yellow Action Tag) */}
            <div className="absolute bottom-[20%] left-[25%] z-20 bg-amber-500 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2">
              <span>I'm on it!</span>
              <div className="w-5 h-5 rounded-full overflow-hidden border border-white/40">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100" className="object-cover w-full h-full" alt="User avatar" />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;