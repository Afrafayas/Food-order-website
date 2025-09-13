
import { useState } from "react";
import Products from "../data/data.json";
import ProductCard from "./ProductCard";
import CategoryFilter from "./CategoryFilter";
import SearchBar from "./SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import toast from "react-hot-toast";

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart) || [];
  const reduxProducts = useSelector((state) => state.products) || [];

  const allProducts = [...Products, ...reduxProducts].map((p) => ({
    ...p,
    count: Number(p.count) || 0,
  }));

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [...new Set(allProducts.map((p) => p.category))];

  const getCartQuantity = (id) => {
    const cartItem = cart.find((cItem) => cItem.id === id);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (item) => {
    const stock = Number(item.count) || 0;
    const cartQty = getCartQuantity(item.id);

    if (cartQty < stock) {
      dispatch(addToCart(item));
      toast.success(`${item.name} added to cart`);
    } else {
      toast.error("No more stock available");
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Top Bar */}
<div className="bg-blue-800 mb-4 py-3">
  {/* Centered container with max width */}
  <div className="flex flex-row items-center justify-between
                  gap-4 w-full max-w-4xl mx-auto px-4">
    {/* Search Bar */}
    <div className="flex-1 min-w-[150px]">
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
    </div>

    {/* Category Filter */}
    <div className="flex-1 min-w-[150px] text-white">
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
    </div>
  </div>
</div>






      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((item) => (
          <ProductCard
            key={item.id}
            id={item.id}
            image={item.image}
            name={item.name}
            category={item.category}
            price={item.price}
            count={item.count}
            onAddToCart={() => handleAddToCart(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
