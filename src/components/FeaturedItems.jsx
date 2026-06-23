import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import ProductCard from './ProductCard';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedItems = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { products, loading } = useSelector(state => state.products);
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const featuredItems = products.slice(0, 8);

  const handleViewMenu = () => {
    if (!isAuthenticated) return navigate('/login');
    if (user?.role === 'user') return navigate('/user-panel/menu');
  };

  const handleAddToCart = (item) => {
    if (!isAuthenticated) {
      toast.error('Please login first!');
      return navigate('/login');
    }
    dispatch(addToCart({
      productId: item._id,
      quantity: 1,
      price: item.price,
    }));
    toast.success(`${item.name} added to cart! 🛒`);
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <p className="text-orange-500 text-xl font-bold animate-pulse">Loading...</p>
    </div>
  );

  return (
    <section className="w-full py-16 px-4 bg-[#0a0f1e] overflow-hidden">
      <div className="max-w-7xl mx-auto relative">

        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-2">🔥 Top Picks</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Featured Best Sellers
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleViewMenu}
              className="text-orange-500 hover:text-orange-400 font-bold text-sm transition mr-4"
            >
              View All Menu →
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => handleScroll('left')}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/5 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                title="Scroll Left"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/5 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                title="Scroll Right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Cards Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featuredItems.map((item) => (
            <div key={item._id} className="w-[280px] sm:w-[320px] md:w-[280px] lg:w-[275px] shrink-0 snap-start">
              <ProductCard
                item={item}
                onAddToCart={() => handleAddToCart(item)}
              />
            </div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 flex justify-center md:hidden">
          <button
            onClick={handleViewMenu}
            className="btn-glow text-white px-8 py-3.5 rounded-xl font-bold transition-all"
          >
            View Full Menu →
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeaturedItems;