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
  const [fading, setFading]     = useState(false);
  const timerRef  = useRef(null);
  const pausedRef  = useRef(false);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) advance();
    }, INTERVAL);
  };

  const advance = () => {
    setFading(true);
    setTimeout(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length);
      setAnimKey(k => k + 1);
      setFading(false);
    }, 600);
  };

  const goTo = (i) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(i);
      setAnimKey(k => k + 1);
      setFading(false);
    }, 300);
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
          0%   { transform: scale(1);    }
          100% { transform: scale(1.08); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes progressBar {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .hero-kb   { animation: kenburns ${INTERVAL + 600}ms ease-out forwards; }
        .fade-up   { animation: fadeInUp 0.7s ease forwards; }
        .prog-bar  {
          transform-origin: left;
          animation: progressBar ${INTERVAL}ms linear forwards;
        }
      `}</style>

      <section className="relative w-full h-screen min-h-[600px] overflow-hidden">

        {/* ── Background image carousel ── */}
        {SLIDES.map((slide, i) => (
          <img
            key={`bg-${i}`}
            src={slide.url}
            alt={slide.label}
            onError={e => { e.target.style.display = 'none'; }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              i === current ? 'opacity-100 hero-kb' : 'opacity-0'
            }`}
          />
        ))}

        {/* ── Gradient overlays ── */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* ── Main content ── */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
            <div className="max-w-2xl" key={`content-${animKey}`}>

              {/* Category badge */}
              <div className="fade-up inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 backdrop-blur-sm text-orange-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
                style={{ animationDelay: '0ms' }}>
                <span className="text-base">{SLIDES[current].emoji}</span>
                {SLIDES[current].label}
              </div>

              {/* Headline */}
              <h1 className="fade-up text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-4 sm:mb-5"
                style={{ animationDelay: '80ms' }}>
                Delicious Food,
                <span className="block text-orange-400">Delivered Fast.</span>
              </h1>

              {/* Subtitle */}
              <p className="fade-up text-gray-300 text-base sm:text-lg max-w-lg mb-6 sm:mb-8 leading-relaxed"
                style={{ animationDelay: '160ms' }}>
                Fresh meals from the best restaurants in Abu Dhabi — hot at your door in 30 minutes.
              </p>

              {/* Search */}
              <form
                onSubmit={handleSearch}
                className="fade-up flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden max-w-lg mb-8 focus-within:border-orange-400 transition-all"
                style={{ animationDelay: '240ms' }}
              >
                <Search className="ml-5 text-white/50 flex-shrink-0" size={20} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => { pausedRef.current = true; }}
                  onBlur={() => { pausedRef.current = false; }}
                  placeholder="Search burgers, pizza, sushi…"
                  className="flex-1 px-4 py-4 bg-transparent text-white placeholder:text-white/40 outline-none text-sm"
                />
                <button type="submit"
                  className="m-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 sm:px-6 py-3 rounded-xl text-sm transition flex items-center gap-1 shrink-0">
                  <Search size={16} className="sm:hidden" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </form>

              {/* CTAs */}
              <div className="fade-up flex flex-wrap gap-3 mb-5 sm:mb-6" style={{ animationDelay: '320ms' }}>
                <button
                  onClick={handleOrder}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-sm sm:text-base transition shadow-lg shadow-orange-500/30 hover:scale-105 transform"
                >
                  Order Now <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="flex items-center gap-2 border-2 border-white/25 hover:border-orange-400 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-sm sm:text-base transition backdrop-blur-sm"
                >
                  Learn More
                </button>
              </div>

              {/* Quick category tags */}
              <div className="fade-up flex flex-wrap gap-2 mb-8" style={{ animationDelay: '370ms' }}>
                {[
                  { emoji: '🍔', label: 'Burgers' },
                  { emoji: '🍕', label: 'Pizza' },
                  { emoji: '🍣', label: 'Sushi' },
                  { emoji: '🌮', label: 'Tacos' },
                  { emoji: '🍰', label: 'Desserts' },
                ].map(({ emoji, label }) => (
                  <button
                    key={label}
                    onClick={() => {
                      if (!isAuthenticated) return navigate('/login');
                      navigate(`/user-panel/menu?category=${encodeURIComponent(label)}`);
                    }}
                    className="flex items-center gap-1.5 bg-white/10 hover:bg-orange-500/80 border border-white/20 hover:border-orange-400 text-white text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm transition-all hover:scale-105"
                  >
                    <span>{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="fade-up flex items-center gap-4 sm:gap-8" style={{ animationDelay: '400ms' }}>
                {[
                  { value: '50+',    label: 'Menu Items'    },
                  { value: '30 min', label: 'Avg Delivery'  },
                  { value: '4.8 ★',  label: 'Rating' },
                ].map(({ value, label }, i) => (
                  <div key={label} className="flex items-center gap-4 sm:gap-8">
                    {i > 0 && <div className="w-px h-8 bg-white/20" />}
                    <div>
                      <p className="text-xl sm:text-2xl font-black text-white">{value}</p>
                      <p className="text-white/50 text-xs mt-0.5">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* ── Bottom bar: dots + progress + label ── */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          {/* Progress bar */}
          <div className="h-0.5 bg-white/10">
            <div key={`pb-${animKey}`} className="prog-bar h-full bg-orange-500" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
            {/* Dot indicators */}
            <div className="flex gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? 'w-8 h-2 bg-orange-500' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            {/* Slide counter */}
            <p className="text-white/40 text-xs font-mono">
              {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </p>
          </div>
        </div>

      </section>
    </>
  );
};

export default HeroSection;
