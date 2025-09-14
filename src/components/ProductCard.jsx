import React from 'react';
import dummyImage from '../assets/no-image.jpg';
import { BiCart } from 'react-icons/bi';

const ProductCard = ({ image, name, category, price, onAddToCart }) => {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
  {/* Product Image */}
  <div className="w-full h-48 md:h-56">
    <img
      src={image || dummyImage}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = dummyImage;
      }}
      alt={name}
      className="w-full h-full object-cover rounded-t-2xl"
    />
  </div>

  {/* Product Details */}
  <div className="p-4 flex flex-col flex-grow">
    <h2 className="text-lg font-semibold text-gray-800 truncate">{name}</h2>
    <p className="text-sm text-gray-500">{category}</p>
    <p className="text-xl font-bold text-blue-600 mt-2">${price}</p>

    {/* Button */}
    <button
      onClick={onAddToCart}
      className="mt-4 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition"
    >
      <BiCart size={20} /> 
      <span>Add to Cart</span>
    </button>
  </div>
</div>

  );
};

export default ProductCard;
