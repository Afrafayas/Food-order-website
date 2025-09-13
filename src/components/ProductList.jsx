// import { useState, useEffect } from "react";
// import Products from "../data/data.json"; // your static JSON
// import ProductCard from "./ProductCard";
// import CategoryFilter from "./CategoryFilter";
// import SearchBar from "./SearchBar";
// import { useDispatch, useSelector } from "react-redux";
// import { addToCart } from "../redux/cartSlice";
// import toast from "react-hot-toast";

// const ProductList = () => {
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   const dispatch = useDispatch();
//   const cart = useSelector((state) => state.cart) || [];

//   // ✅ Redux products
//   const reduxProducts = useSelector((state) => state.products) || [];

//   // ✅ Merge static JSON + Redux products
//   const allProducts = [...Products, ...reduxProducts].map((p) => ({
//     ...p,
//     count: Number(p.count) || 0,
//   }));

//   // ✅ Filtered by category + search
//   const filteredProducts = allProducts.filter((product) => {
//     const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
//     const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   // ✅ Extract unique categories
//   const categories = [...new Set(allProducts.map((p) => p.category))];

//   // ✅ Cart quantity helper
//   const getCartQuantity = (id) => {
//     const cartItem = cart.find((cItem) => cItem.id === id);
//     return cartItem ? cartItem.quantity : 0;
//   };

//   const handleAddToCart = (item) => {
//     const stock = Number(item.count) || 0;
//     const cartQty = getCartQuantity(item.id);

//     if (cartQty < stock) {
//       dispatch(addToCart(item));
//       toast.success(`${item.name} added to cart`);
//     } else {
//       toast.error("No more stock available");
//     }
//   };

//   return (
//     <>
//       <div className="bg-blue-800 h-14 mb-3 flex flex-row items-center justify-between gap-3 px-4">
//   <div className="flex-1 max-w-xs">
//     <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
//   </div>
//   <div className="flex-1 max-w-xs text-white">
//     <CategoryFilter
//       categories={categories}
//       selectedCategory={selectedCategory}
//       onCategoryChange={setSelectedCategory}
//     />
//   </div>
// </div>


//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 pt-4">
//         {filteredProducts.map((item) => (
//           <ProductCard
//             key={item.id}
//             id={item.id}
//             image={item.image}
//             name={item.name}
//             category={item.category}
//             price={item.price}
//             count={item.count}
//             onAddToCart={() => handleAddToCart(item)}
//           />
//         ))}
//       </div>
//     </>
//   );
// };

// export default ProductList;



import { useState, useEffect } from "react";
import Products from "../data/data.json"; // your static JSON
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

  // ✅ Redux products
  const reduxProducts = useSelector((state) => state.products) || [];

  // ✅ Merge static JSON + Redux products
  const allProducts = [...Products, ...reduxProducts].map((p) => ({
    ...p,
    count: Number(p.count) || 0,
  }));

  // ✅ Filtered by category + search
  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ✅ Extract unique categories
  const categories = [...new Set(allProducts.map((p) => p.category))];

  // ✅ Cart quantity helper
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
    <>
      <div className="bg-blue-800 h-14 mb-3 flex flex-row items-center justify-between gap-3 px-4">
  <div className="flex-1 max-w-xs">
    <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
  </div>
  <div className="flex-1 max-w-xs text-white">
    <CategoryFilter
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
    />
  </div>
</div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 pt-4">
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
    </>
  );
};

export default ProductList;
