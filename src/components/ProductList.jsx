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
      toast.error("No more stock available!");
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((item) => (
              <ProductCard
                key={item._id}
                item={item}
                onAddToCart={() => handleAddToCart(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;