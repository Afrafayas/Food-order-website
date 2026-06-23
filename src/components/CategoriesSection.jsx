import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../redux/productSlice';

const categoryIcons = {
  'Burgers': '🍔',
  'Pizza': '🍕',
  'Salads': '🥗',
  'Drinks': '🥤',
  'Desserts': '🍰',
  'Chinese': '🍜',
  'Indian': '🍛',
  'Sandwiches': '🥪',
  'Breakfast': '🍳',
};

const CategoriesSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { products } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = [...new Map(
    products
      .filter(p => p.category)
      .map(p => [p.category._id, p.category])
  ).values()];

  const handleCategoryClick = () => {
    if (!isAuthenticated) return navigate('/login');
    if (user?.role === 'user') return navigate('/user-panel/menu');
  };

  return (
    <section className="w-full py-16 px-4 bg-[#0a0f1e]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-2">Craving Something?</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
            Browse by Category
          </h2>
          <p className="text-gray-400 text-sm">Find your favorite dishes with one click 😋</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {categories.map((category) => (
            <div
              key={category._id}
              onClick={handleCategoryClick}
              className="flex flex-col items-center justify-center gap-4 p-8 bg-white/5 hover:bg-orange-500/10 border border-white/5 hover:border-orange-500/30 rounded-2xl cursor-pointer transition-all duration-300 group shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_25px_rgba(255,107,53,0.15)] hover:scale-105"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-orange-500/20 flex items-center justify-center text-4xl group-hover:scale-110 transition-all duration-350 shadow-inner">
                {categoryIcons[category.name] || '🍽️'}
              </div>
              <p className="font-bold text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;