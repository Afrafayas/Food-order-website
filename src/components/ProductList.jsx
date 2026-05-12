import { useState } from "react";
import ProductCard from "./ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import toast from "react-hot-toast";
import { Search } from "lucide-react";

const ProductList = ({ products = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items) || [];

  // Unique categories
  const categories = ["All", ...new Set(
    products.map(p => p.category?.name).filter(Boolean)
  )];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All"
      ? true
      : product.category?.name === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCartQuantity = (id) => {
    const cartItem = cart.find((item) => item.product === id || item.product?._id === id);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (item) => {
    const stock = Number(item.stock) || 0;
    const cartQty = getCartQuantity(item._id);
    if (cartQty < stock) {
      dispatch(addToCart({
        productId: item._id,
        quantity: 1,
        price: item.price,
      }));
      toast.success(`${item.name} added to cart! 🛒`);
    } else {
      toast.error("No more stock available");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-white mb-2">
            🍔 Our Menu
          </h1>
          <p className="text-orange-100 mb-4">
            Fresh & delicious food delivered fast!
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="bg-white shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-orange-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-400 text-6xl mb-4">🍽️</p>
            <p className="text-gray-500 text-xl font-semibold">No products found!</p>
            <p className="text-gray-400 text-sm mt-2">Try a different category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-48">
                  <img
                    src={item.image || '/no-image.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 bg-white/90 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                    {item.category?.name}
                  </span>
                  {/* Stock Badge */}
                  {item.stock <= 5 && item.stock > 0 && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Only {item.stock} left!
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-1">
                    {item.description || 'Delicious & fresh!'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-500 font-extrabold text-xl">
                      AED {item.price}
                    </span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;