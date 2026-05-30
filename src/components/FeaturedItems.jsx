import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import ProductCard from './ProductCard';
import toast from 'react-hot-toast';

const FeaturedItems = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { products, loading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const featuredItems = products.slice(0, 4);

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
    <section className="w-full py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-orange-500 font-semibold mb-1">🔥 Top Picks</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
              Featured Best Sellers
            </h2>
          </div>
          <button
            onClick={handleViewMenu}
            className="hidden md:flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold transition"
          >
            View All Menu →
          </button>
        </div>

        {/* Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {featuredItems.map((item) => (
            <ProductCard
              key={item._id}
              item={item}
              onAddToCart={() => handleAddToCart(item)}
            />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 flex justify-center md:hidden">
          <button
            onClick={handleViewMenu}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            View Full Menu →
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeaturedItems;