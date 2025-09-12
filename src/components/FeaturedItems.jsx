import React from 'react';
import menuData from '../data/data.json';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { BiCart } from 'react-icons/bi';

const FeaturedItems = () => {
  const featuredItems = menuData.filter(item => item.featured);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const handleViewMenu = () => {
    if (!isAuthenticated) return navigate('/login');
    if (user?.role === 'user') return navigate('/user-panel/menu');
  };

  const handleAddToCart = (item) => {
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <section className="py-10 px-4 bg-[#D9D9D9] text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
        Featured Best Sellers
      </h2>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {featuredItems?.map(item => (
          <div
            key={item?.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-4 flex flex-col"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="rounded-xl mb-3 w-full aspect-[4/3] object-cover"
              />
            )}
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            <p className="text-blue-600 font-bold mt-1">${item.price.toFixed(2)}</p>

            {isAuthenticated && user?.role === 'user' && (
              <button
                onClick={() => handleAddToCart(item)}
                className="mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium px-4 py-2 rounded-lg transition"
              >
                <BiCart size={20} />
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleViewMenu}
        className="mt-8 bg-red-500 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow transition"
      >
        View Full Menu
      </button>
    </section>
  );
};

export default FeaturedItems;
