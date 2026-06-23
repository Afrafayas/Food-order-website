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
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 cursor-pointer"
    >

      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={image || dummyImage}
          onError={(e) => { e.target.src = dummyImage; }}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Dynamic Deal Tag */}
        {dynamicTag && (
          <span className={`absolute top-2 left-2 ${dealTagColors[dynamicTag] || 'bg-orange-500'} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
            {dynamicTag}
          </span>
        )}

        {/* Discount */}
        {isOnSale && discountPercent > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {discountPercent}% OFF
          </span>
        )}

        {/* Countdown Timer */}
        {item.dealExpiry && !expired && timeLeft && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
            ⏱️ {timeLeft}
          </div>
        )}

        {/* Expired Overlay */}
        {expired && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-xs bg-red-500 px-2 py-1 rounded-full">
              Deal Expired!
            </span>
          </div>
        )}

        {/* Wishlist */}
        {isAuthenticated && (
          <button
            onClick={handleWishlist}
            className="absolute bottom-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition"
          >
            <Heart size={13} className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
          </button>
        )}

        {/* Out of Stock */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-xs bg-red-500 px-2 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[10px] text-orange-500 font-semibold uppercase tracking-wide">
          {category?.name || category}
        </p>
        <h3 className="font-semibold text-gray-800 text-sm truncate mt-0.5">{name}</h3>

        {/* Rating */}
        {reviewCount > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-semibold text-gray-600">{rating}</span>
            <span className="text-[10px] text-gray-400">({reviewCount})</span>
          </div>
        )}

        {/* Stock Warning */}
        {stock > 0 && stock <= 5 && (
          <p className="text-red-500 text-[10px] font-semibold mt-1">Only {stock} left!</p>
        )}

        {/* Price + Button */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-orange-500 font-bold text-sm">AED {price}</span>
            {isOnSale && originalPrice && (
              <span className="text-gray-400 text-[10px] line-through ml-1">AED {originalPrice}</span>
            )}
          </div>
          <button
            onClick={e => { e.stopPropagation(); onAddToCart(); }}
            disabled={stock === 0}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white w-7 h-7 rounded-full flex items-center justify-center transition"
          >
            <ShoppingCart size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;