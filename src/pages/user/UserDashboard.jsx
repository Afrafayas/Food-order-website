import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Clock, Truck, ShieldCheck, Headphones, Star, ArrowRight, Zap, Gift, Percent } from 'lucide-react';
import HeroSection from '../../components/HeroSection';
import FeaturedItems from '../../components/FeaturedItems';
import { fetchProducts } from '../../redux/productSlice';

const CATEGORY_ICONS = {
  Burgers: '🍔', Pizza: '🍕', Pasta: '🍝', Sushi: '🍣',
  Desserts: '🍰', Drinks: '🥤', Salads: '🥗', Sandwiches: '🥪',
  Chicken: '🍗', Seafood: '🦐', Wraps: '🌯', Soups: '🍲',
};

const HOW_IT_WORKS = [
  { step: '01', icon: '🔍', title: 'Browse Menu',   desc: 'Explore hundreds of fresh dishes across all your favourite categories.' },
  { step: '02', icon: '🛒', title: 'Place Order',   desc: 'Add items to cart, apply a promo code and checkout in seconds.' },
  { step: '03', icon: '🚀', title: 'Fast Delivery', desc: 'Your meal is prepared fresh and delivered hot to your door in 30 min.' },
];

const WHY_US = [
  { icon: <Clock size={28} className="text-orange-500" />,     title: '30-Min Delivery', desc: 'We guarantee your food arrives hot and on time, every single order.' },
  { icon: <ShieldCheck size={28} className="text-orange-500" />, title: 'Quality Assured', desc: 'Every dish is prepared with fresh, locally sourced ingredients.' },
  { icon: <Headphones size={28} className="text-orange-500" />, title: '24/7 Support',    desc: 'Our support team is always here to help with any issue, any time.' },
  { icon: <Truck size={28} className="text-orange-500" />,      title: 'Free Delivery',   desc: 'Enjoy free delivery on all orders above AED 50 — no hidden fees.' },
];

const TESTIMONIALS = [
  { name: 'Sarah M.',   rating: 5, text: 'Absolutely love BiteCraft! The food always arrives hot and the app is super easy to use.', avatar: '👩‍💼', location: 'Abu Dhabi' },
  { name: 'Ahmed K.',   rating: 5, text: 'Best food delivery in Abu Dhabi. The burgers are incredible and delivery is always on time.', avatar: '👨‍💻', location: 'Dubai' },
  { name: 'Priya R.',   rating: 4, text: 'Great variety of food and excellent customer service. Will definitely order again!', avatar: '👩‍🍳', location: 'Sharjah' },
  { name: 'Omar S.',    rating: 5, text: 'I order from BiteCraft almost every day. The sushi platter is absolutely amazing!', avatar: '👨‍🎨', location: 'Abu Dhabi' },
  { name: 'Fatima H.',  rating: 5, text: 'Fast, fresh, and always accurate. Never had a wrong order. Highly recommended!', avatar: '👩‍🔬', location: 'Al Ain' },
  { name: 'Raj P.',     rating: 4, text: 'The app is sleek and the food quality is consistently great. Love the promo codes!', avatar: '👨‍🏫', location: 'Dubai' },
];

const DEALS = [
  {
    tag: '🔥 Hot Deal',
    title: '20% Off Burgers',
    desc: 'Every Tuesday on all burger combos',
    code: 'BURGER20',
    bg: 'from-orange-500 to-red-500',
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
  },
  {
    tag: '⚡ Flash Sale',
    title: 'Free Drink on Pizza',
    desc: 'Order any large pizza and get a free drink',
    code: 'PIZZADRINK',
    bg: 'from-purple-600 to-indigo-600',
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
  },
  {
    tag: '🎁 Weekend Special',
    title: 'Buy 2 Get 1 Free',
    desc: 'On all sushi rolls every weekend',
    code: 'SUSHI3',
    bg: 'from-emerald-500 to-teal-600',
    img: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=300&fit=crop',
  },
];

const STATS = [
  { value: 12000, suffix: '+', label: 'Orders Delivered', icon: '📦' },
  { value: 8500,  suffix: '+', label: 'Happy Customers',  icon: '😊' },
  { value: 50,    suffix: '+', label: 'Menu Items',        icon: '🍽️' },
  { value: 4.8,   suffix: '★', label: 'Average Rating',   icon: '⭐', decimal: true },
];

// Animated counter hook
function useCounter(target, duration = 1800, decimal = false) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(decimal ? +(eased * target).toFixed(1) : Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, decimal]);

  return [count, ref];
}

function StatCard({ value, suffix, label, icon, decimal }) {
  const [count, ref] = useCounter(value, 1800, decimal);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-4xl font-black text-white">{count}{suffix}</p>
      <p className="text-white/60 text-sm mt-1">{label}</p>
    </div>
  );
}

const UserDashboard = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { products } = useSelector(state => state.products);

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  const categories = [...new Set(products.map(p => p.category?.name).filter(Boolean))];

  const goToMenu = () => {
    if (!isAuthenticated) return navigate('/login');
    navigate('/user-panel/menu');
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <div className="w-full bg-white">

      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Animated Stats Counter ── */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          {STATS.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-2">Simple & Fast</p>
            <h2 className="text-4xl font-extrabold text-gray-800">How It Works</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Getting your favourite food delivered has never been easier — just three steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-orange-200 z-0" />
            {HOW_IT_WORKS.map(({ step, icon, title, desc }) => (
              <div key={step} className="relative z-10 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">{icon}</div>
                <span className="text-xs font-black text-orange-400 tracking-widest">STEP {step}</span>
                <h3 className="text-xl font-bold text-gray-800 mt-1 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Today's Deals ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-2">Save More</p>
              <h2 className="text-4xl font-extrabold text-gray-800">Today's Deals</h2>
            </div>
            <button onClick={goToMenu} className="hidden md:flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold transition">
              All Deals <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEALS.map(deal => (
              <div key={deal.code} className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition group cursor-pointer" onClick={goToMenu}>
                <div className="relative h-44 overflow-hidden">
                  <img src={deal.img} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" onError={e => { e.target.style.display='none'; }} />
                  <div className={`absolute inset-0 bg-gradient-to-r ${deal.bg} opacity-70`} />
                  <span className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">{deal.tag}</span>
                </div>
                <div className="p-5 border border-t-0 border-gray-100 rounded-b-2xl">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{deal.title}</h3>
                  <p className="text-gray-500 text-sm mb-3">{deal.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-orange-50 border border-dashed border-orange-300 px-3 py-1.5 rounded-lg">
                      <Percent size={13} className="text-orange-500" />
                      <span className="text-orange-600 font-black text-sm tracking-widest">{deal.code}</span>
                    </div>
                    <span className="text-orange-500 text-sm font-semibold">Grab Deal →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by Category ── */}
      {categories.length > 0 && (
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-2">What are you craving?</p>
                <h2 className="text-4xl font-extrabold text-gray-800">Browse by Category</h2>
              </div>
              <button onClick={goToMenu} className="hidden md:flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold transition">
                View All <ArrowRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map(cat => (
                <button key={cat} onClick={goToMenu}
                  className="group bg-white hover:bg-orange-500 border border-gray-100 hover:border-orange-500 rounded-2xl p-5 text-center transition-all duration-200 hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-1">
                  <div className="text-4xl mb-3">{CATEGORY_ICONS[cat] || '🍽️'}</div>
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-white transition-colors">{cat}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Items ── */}
      <div className="bg-white"><FeaturedItems /></div>

      {/* ── Our Story ── */}
      <section className="py-20 px-4 bg-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-video lg:aspect-square max-w-lg">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&h=700&fit=crop"
                alt="Our kitchen"
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display='none'; }}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-orange-500 rounded-2xl px-6 py-5 shadow-xl">
              <p className="text-white font-black text-3xl">5+</p>
              <p className="text-orange-100 text-sm">Years of Service</p>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-orange-400 font-semibold text-sm uppercase tracking-widest mb-4">Our Story</p>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              Passionate About <span className="text-orange-400">Great Food</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              BiteCraft started in 2019 with one simple mission — to bring the best local restaurant meals to your door, fresh and fast. What began as a small team of food lovers has grown into Abu Dhabi's most loved food delivery platform.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              We work directly with local chefs and restaurants to ensure every dish meets our quality standards. No shortcuts, no compromises — just great food delivered with care.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: <Zap size={18} className="text-orange-400" />, text: 'Lightning fast delivery' },
                { icon: <Gift size={18} className="text-orange-400" />, text: 'Daily deals & offers' },
                { icon: <ShieldCheck size={18} className="text-orange-400" />, text: 'Quality guaranteed' },
                { icon: <Star size={18} className="text-orange-400" />, text: '4.8 star rated service' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-gray-300 text-sm">
                  {icon} {text}
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/about')}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl transition">
              Read Our Story <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section className="py-14 px-4 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-orange-100 text-sm font-bold uppercase tracking-widest mb-3">Limited Time Offer</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Free Delivery on Your <span className="text-orange-200">First Order!</span>
          </h2>
          <p className="text-orange-100 text-lg mb-8">Use code <span className="bg-white/20 text-white font-bold px-3 py-1 rounded-lg">FIRST50</span> at checkout.</p>
          <button onClick={goToMenu} className="bg-white text-orange-500 font-black px-10 py-4 rounded-2xl text-lg hover:bg-orange-50 transition shadow-xl">
            Order Now 🍕
          </button>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-2">Our Promise</p>
            <h2 className="text-4xl font-extrabold text-gray-800">Why Choose BiteCraft?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map(({ icon, title, desc }) => (
              <div key={title} className="p-8 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition group">
                <div className="w-14 h-14 bg-orange-50 group-hover:bg-orange-100 rounded-2xl flex items-center justify-center mb-5 transition">{icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-2">Happy Customers</p>
            <h2 className="text-4xl font-extrabold text-gray-800">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, rating, text, avatar, location }) => (
              <div key={name} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} className={i < rating ? 'fill-orange-400 text-orange-400' : 'fill-gray-200 text-gray-200'} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-xl">{avatar}</div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{name}</p>
                    <p className="text-gray-400 text-xs">{location} · Verified Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-20 px-4 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">Stay in the Loop</p>
          <h2 className="text-4xl font-extrabold text-gray-800 mb-3">Get Exclusive Deals</h2>
          <p className="text-gray-500 mb-8">Subscribe and be the first to know about new dishes, flash sales, and special promo codes.</p>
          {subscribed ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl font-semibold">
              🎉 You're subscribed! Watch your inbox for exclusive deals.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
              />
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-4 rounded-2xl text-sm transition whitespace-nowrap">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-orange-400 font-semibold text-sm uppercase tracking-widest mb-3">Ready to eat?</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Great food is one tap away</h2>
          <p className="text-gray-400 text-lg mb-10">Join thousands of happy customers who trust BiteCraft for their daily meals.</p>
          <button onClick={goToMenu}
            className="bg-orange-500 hover:bg-orange-600 text-white font-black px-12 py-5 rounded-2xl text-lg transition shadow-xl shadow-orange-500/30 hover:scale-105 transform">
            Explore the Menu →
          </button>
        </div>
      </section>

    </div>
  );
};

export default UserDashboard;
