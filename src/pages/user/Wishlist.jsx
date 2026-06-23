import React, { useEffect, useState } from 'react';
import { getWishlist, toggleWishlist } from '../../services/api';
import { addToCart } from '../../redux/cartSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import dummyImage from '../../assets/no-image.jpg';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      const data = res.data;
      if (Array.isArray(data)) {
        setWishlist(data);
      } else if (data?.products && Array.isArray(data.products)) {
        setWishlist(data.products);
      } else if (data?.items && Array.isArray(data.items)) {
        setWishlist(data.items);
      } else {
        setWishlist([]);
      }
    } catch (err) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await toggleWishlist(productId);
      setWishlist(prev => prev.filter(item =>
        (item.product?._id || item._id) !== productId
      ));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1, price: product.price })).unwrap();
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-orange-500 text-xl font-bold">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Heart className="text-red-500" size={28} />
            My Wishlist
          </h1>
          <p className="text-gray-500 mt-1">{wishlist.length} items saved</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <Heart size={56} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-xl font-semibold">Your wishlist is empty</p>
            <p className="text-gray-400 text-sm mt-2">Save items you love!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {wishlist.map((item) => {
              const product = item.product || item;
              return (
                <div key={product._id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">
                  {/* Image */}
                  <div className="h-44 bg-gray-100 relative">
                    <img
                      src={product.image || dummyImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = dummyImage; }}
                    />
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow text-red-400 hover:text-red-600 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500 truncate mt-0.5">{product.category?.name}</p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-lg font-bold text-orange-500">
                        AED {product.price?.toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex items-center gap-1.5 bg-orange-500 text-white px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition"
                      >
                        <ShoppingCart size={14} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;