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
    <section className="w-full py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
            Browse by Category
          </h2>
          <p className="text-gray-500">What are you craving today? 😋</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <div
              key={category._id}
              onClick={handleCategoryClick}
              className="flex flex-col items-center justify-center gap-3 p-6 bg-orange-50 hover:bg-orange-500 text-gray-700 hover:text-white rounded-2xl cursor-pointer transition-all duration-300 group shadow-sm hover:shadow-lg hover:scale-105"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                {categoryIcons[category.name] || '🍽️'}
              </span>
              <p className="font-semibold text-sm text-center">
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