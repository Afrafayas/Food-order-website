import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleWishlist, checkWishlist } from '../services/api';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import dummyImage from '../assets/no-image.jpg';
import toast from 'react-hot-toast';

// ✅ Outside component — OK (no item use):
const isNewArrivalProduct = (createdAt) => {
  if (!createdAt) return false;
  const daysDiff = (Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24);
  return daysDiff <= 7;
};

const useCountdown = (expiryDate) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!expiryDate) return;
    const timer = setInterval(() => {
      const diff = new Date(expiryDate) - new Date();
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft('Expired');
        clearInterval(timer);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [expiryDate]);

  return { timeLeft, expired };
};

const dealTagColors = {
  'Best Seller': 'bg-orange-500',
  'New Arrival': 'bg-green-500',
  'Limited Time': 'bg-purple-500',
  'Mega Deal': 'bg-red-500',
};

const ProductCard = ({ item, onAddToCart }) => {
  const { timeLeft, expired } = useCountdown(item.dealExpiry);
  const { isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [inWishlist, setInWishlist] = useState(false);

  const {
    _id, name, image, category, price,
    originalPrice, discountPercent, isOnSale,
    dealTag, stock, rating, reviewCount, description,
  } = item;

  // ✅ Inside component — item available!
  const dynamicTag = dealTag || 
    (isNewArrivalProduct(item.createdAt) ? 'New Arrival' : null);

  useEffect(() => {
    if (isAuthenticated && _id) {
      checkWishlist(_id)
        .then(res => setInWishlist(res.data))
        .catch(() => {});
    }
  }, [_id, isAuthenticated]);

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return toast.error('Please login first!');
    try {
      await toggleWishlist(_id);
      setInWishlist(!inWishlist);
      toast.success(inWishlist ? 'Removed!' : 'Added to wishlist! ❤️');
    } catch {
      toast.error('Something went wrong!');
    }
  };

  return (
    <div
      onClick={() => navigate(`/user-panel/product/${_id}`)}
      className="group bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_35px_rgba(255,107,53,0.15)] hover:border-orange-500/25 transition-all duration-300 cursor-pointer flex flex-col h-full hover:-translate-y-1"
    >

      {/* Image Container with overlays */}
      <div className="relative h-44 overflow-hidden shrink-0">
        <img
          src={image || dummyImage}
          onError={(e) => { e.target.src = dummyImage; }}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Bottom dark vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e]/90 via-transparent to-transparent" />

        {/* Dynamic Deal Tag */}
        {dynamicTag && (
          <span className={`absolute top-3 left-3 ${dealTagColors[dynamicTag] || 'bg-orange-500'} text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg shadow-md`}>
            {dynamicTag}
          </span>
        )}

        {/* Discount */}
        {isOnSale && discountPercent > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg shadow-md animate-pulse">
            {discountPercent}% OFF
          </span>
        )}

        {/* Countdown Timer */}
        {item.dealExpiry && !expired && timeLeft && (
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-1 rounded-lg flex items-center gap-1 border border-white/5">
            ⏱️ {timeLeft}
          </div>
        )}

        {/* Expired Overlay */}
        {expired && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center backdrop-blur-[2px]">
            <span className="text-white font-bold text-xs bg-red-500 px-3 py-1 rounded-xl shadow-lg border border-red-400/20">
              Deal Expired
            </span>
          </div>
        )}

        {/* Wishlist */}
        {isAuthenticated && (
          <button
            onClick={handleWishlist}
            className="absolute bottom-3 right-3 w-8 h-8 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all border border-white/10"
          >
            <Heart size={14} className={inWishlist ? 'fill-red-500 text-red-500' : 'text-white/80'} />
          </button>
        )}

        {/* Out of Stock */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-[#0a0f1e]/75 flex items-center justify-center backdrop-blur-[2px]">
            <span className="text-white font-bold text-xs bg-red-500 px-3 py-1 rounded-xl shadow-lg border border-red-400/20">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <p className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">
            {category?.name || category}
          </p>
          <h3 className="font-bold text-white text-base truncate mt-1 group-hover:text-orange-400 transition-colors duration-300">{name}</h3>

          {/* Rating */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-1 mt-2 bg-white/5 w-fit px-2 py-0.5 rounded-lg border border-white/5">
              <Star size={11} className="fill-[#ffd700] text-[#ffd700]" />
              <span className="text-[10px] font-black text-[#ffd700]">{rating}</span>
              <span className="text-[10px] text-gray-400">({reviewCount})</span>
            </div>
          )}

          {/* Stock Warning */}
          {stock > 0 && stock <= 5 && (
            <p className="text-red-400 text-[10px] font-semibold mt-2 animate-pulse">Only {stock} left!</p>
          )}
        </div>

        {/* Price + Button */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-orange-400 font-black text-base">AED {price.toFixed(2)}</span>
            {isOnSale && originalPrice && (
              <span className="text-gray-500 text-xs line-through ml-1.5 font-semibold">AED {originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={e => { e.stopPropagation(); onAddToCart(); }}
            disabled={stock === 0}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-800 text-white w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg shadow-orange-500/20 disabled:shadow-none"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;