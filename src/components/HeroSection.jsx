import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';

const SLIDES = [
  { url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&h=900&fit=crop', label: 'Gourmet Burgers',  emoji: '🍔' },
  { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&h=900&fit=crop', label: 'Fresh Pizza',       emoji: '🍕' },
  { url: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=1600&h=900&fit=crop', label: 'Sushi Platters',    emoji: '🍣' },
  { url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&h=900&fit=crop', label: 'Healthy Bowls',     emoji: '🥗' },
  { url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600&h=900&fit=crop', label: 'Fresh Salads',      emoji: '🥬' },
];

const INTERVAL = 4500;

const HeroSection = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [search, setSearch]     = useState('');
  const [current, setCurrent]   = useState(0);
  const [animKey, setAnimKey]   = useState(0);
  const timerRef  = useRef(null);
  const pausedRef  = useRef(false);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) advance();
    }, INTERVAL);
  };

  const advance = () => {
    setCurrent(prev => (prev + 1) % SLIDES.length);
    setAnimKey(k => k + 1);
  };

  const goTo = (i) => {
    setCurrent(i);
    setAnimKey(k => k + 1);
    startTimer();
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate('/login');
    navigate(`/user-panel/menu${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ''}`);
  };

  const handleOrder = () => {
    if (!isAuthenticated) return navigate('/login');
    if (user?.role === 'admin') return navigate('/admin-panel');
    navigate('/user-panel/menu');
  };

  return (
    <>
      <style>{`
        @keyframes kenburns {
          0%   { transform: scale(1.02); }
          100% { transform: scale(1.10); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .hero-kb  { animation: kenburns ${INTERVAL + 1000}ms ease-out forwards; }
        .fade-up  { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      <section className="relative w-full min-h-[650px] lg:h-[calc(100vh-4rem)] flex items-center bg-background py-16 lg:py-0 overflow-hidden transition-colors duration-300">
        
        {/* Decorative Blur Blobs */}
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-yellow-500/10 dark:bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left" key={`content-${animKey}`}>
            
            {/* Tag badge */}
            <div 
              className="fade-up inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 px-4.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-orange-500 mb-6 w-fit"
              style={{ animationDelay: '0ms' }}
            >
              <span>✨ Premium Delivery</span>
            </div>

            {/* Headline */}
            <h1 
              className="fade-up text-4xl sm:text-5xl lg:text-6xl font-black text-text leading-[1.08] mb-5 tracking-tight"
              style={{ animationDelay: '80ms' }}
            >
              Delicious Food,
              <span className="block bg-gradient-to-r from-[#ff6b35] to-[#ffd700] bg-clip-text text-transparent">Delivered Fast.</span>
            </h1>

            {/* Subtitle */}
            <p 
              className="fade-up text-text opacity-75 text-base sm:text-lg max-w-lg mb-8 leading-relaxed"
              style={{ animationDelay: '160ms' }}
            >
              Order fresh, restaurant-quality meals from the best spots in Abu Dhabi. Delivered hot to your doorstep in 30 minutes.
            </p>

            {/* Search Input */}
            <form
              onSubmit={handleSearch}
              className="fade-up flex items-center bg-white dark:bg-white/5 border border-border-color rounded-2xl overflow-hidden max-w-lg mb-8 focus-within:border-orange-500/60 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              style={{ animationDelay: '240ms' }}
            >
              <Search className="ml-5 text-text opacity-40 flex-shrink-0" size={18} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => { pausedRef.current = true; }}
                onBlur={() => { pausedRef.current = false; }}
                placeholder="Search burgers, pizza, sushi…"
                className="flex-1 px-4 py-4 bg-transparent text-text placeholder:text-text/40 outline-none text-sm border-none focus:ring-0 focus:outline-none"
              />
              <button 
                type="submit"
                className="m-2 btn-glow text-white font-bold px-3 sm:px-6 py-3 rounded-xl text-xs sm:text-sm transition flex items-center gap-1 shrink-0"
              >
                <Search size={16} className="sm:hidden" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </form>

            {/* CTAs */}
            <div className="fade-up flex flex-wrap gap-3 mb-8" style={{ animationDelay: '320ms' }}>
              <button
                onClick={handleOrder}
                className="flex items-center gap-2 btn-glow text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base hover:scale-105 transform active:scale-95"
              >
                Order Now <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/about')}
                className="flex items-center gap-2 border border-border-color hover:border-orange-500 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-text font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base transition-all duration-300"
              >
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="fade-up flex items-center gap-4 sm:gap-8 border-t border-border-color pt-6 max-w-lg" style={{ animationDelay: '400ms' }}>
              {[
                { value: '50+',    label: 'Menu Items'    },
                { value: '30 min', label: 'Avg Delivery'  },
                { value: '4.8 ★',  label: 'Rating' },
              ].map(({ value, label }, i) => (
                <div key={label} className="flex items-center gap-4 sm:gap-8">
                  {i > 0 && <div className="w-px h-8 bg-border-color" />}
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-text leading-none">{value}</p>
                    <p className="text-text opacity-60 text-xs mt-1.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Visual Showcase Frame */}
          <div className="lg:col-span-6 relative flex justify-center items-center w-full h-[350px] sm:h-[450px]">
            {/* Border frame block with orange gradient glows */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-yellow-500 opacity-10 dark:opacity-20 blur-[30px] rounded-[3rem] transform rotate-3" />
            
            <div className="relative w-full max-w-[450px] aspect-[4/3] rounded-[2.5rem] overflow-hidden border-4 border-background shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
              {SLIDES.map((slide, i) => (
                <img
                  key={`img-${i}`}
                  src={slide.url}
                  alt={slide.label}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                    i === current ? 'opacity-100 scale-100 hero-kb' : 'opacity-0 scale-95'
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Info Tag */}
            <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-[#10162d]/90 backdrop-blur-md px-4.5 py-2.5 rounded-2xl flex items-center gap-2 border border-border-color shadow-lg transform -rotate-2">
              <span className="text-xl">{SLIDES[current].emoji}</span>
              <span className="font-bold text-xs uppercase tracking-wider text-text">{SLIDES[current].label}</span>
            </div>
          </div>

        </div>

        {/* ── Bottom dots indicators ── */}
        <div className="absolute bottom-6 right-6 lg:right-12 z-20 flex items-center gap-3 bg-white/80 dark:bg-[#10162d]/80 backdrop-blur-md px-4 py-2 rounded-full border border-border-color shadow-md">
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 h-1.5 bg-orange-500' : 'w-1.5 h-1.5 bg-text opacity-20 hover:opacity-40'
                }`}
              />
            ))}
          </div>
          <div className="w-px h-3 bg-border-color" />
          <p className="text-text opacity-60 text-[10px] font-mono">
            {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </p>
        </div>

      </section>
    </>
  );
};

export default HeroSection;
