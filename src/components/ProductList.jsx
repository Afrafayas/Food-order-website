import { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import toast from "react-hot-toast";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const slides = [
  {
    bg: "from-orange-500 to-red-500",
    tag: "🔥 Today's Special",
    title: "Hot Deals on",
    accent: "Burgers & More",
    subtitle: "Order now and save big on your favourite comfort food",
    perks: ["Free delivery on orders above $20", "Fresh ingredients every day"],
    images: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=240&h=240&fit=crop",
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=240&h=240&fit=crop",
      "https://images.unsplash.com/photo-1586816001966-79b736744398?w=240&h=240&fit=crop",
    ],
    btnText: "Order Now",
    btnClass: "bg-white text-orange-500 hover:bg-orange-50",
  },
  {
    bg: "from-emerald-500 to-teal-600",
    tag: "🚀 Lightning Fast",
    title: "Delivered in",
    accent: "30 Minutes",
    subtitle: "Real-time tracking and a hot & fresh guarantee",
    perks: ["Live order tracking", "Contactless delivery"],
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=240&h=240&fit=crop",
      "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=240&h=240&fit=crop",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=240&h=240&fit=crop",
    ],
    btnText: "See Menu",
    btnClass: "bg-white text-emerald-600 hover:bg-emerald-50",
  },
  {
    bg: "from-purple-600 to-indigo-600",
    tag: "✨ New Arrivals",
    title: "Try Our",
    accent: "New Menu",
    subtitle: "Freshly added dishes crafted by our top chefs",
    perks: ["Seasonal ingredients", "Chef's special recipes"],
    images: [
      "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=240&h=240&fit=crop",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=240&h=240&fit=crop",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=240&h=240&fit=crop",
    ],
    btnText: "Explore New",
    btnClass: "bg-white text-purple-600 hover:bg-purple-50",
  },
];

const ProductList = ({ products = [], loading = false, initialSearch = '', initialCategory = 'All' }) => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef(null);

  // Sync filter state when URL params change while already on the menu page
  useEffect(() => {
    const q   = searchParams.get("search")   || "";
    const cat = searchParams.get("category") || "All";
    setSearchTerm(q);
    setSelectedCategory(cat);
    if (q || cat !== "All") {
      setTimeout(() => {
        document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, [searchParams]);

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items) || [];

  const categories = ["All", ...new Set(
    products.map(p => p.category?.name).filter(Boolean)
  )];

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
      dispatch(addToCart({ productId: item._id, quantity: 1, price: item.price }));
      toast.success(`${item.name} added to cart! 🛒`);
    } else {
      toast.error("No more stock available!");
    }
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4500);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (index) => {
    setCurrentSlide(index);
    startTimer();
  };

  const prev = () => goTo((currentSlide - 1 + slides.length) % slides.length);
  const next = () => goTo((currentSlide + 1) % slides.length);

  const slide = slides[currentSlide];

  return (
    <div className="w-full min-h-screen bg-[#0a0f1e] text-white">

      {/* Promotional Slider */}
      <div className="px-4 sm:px-6 md:px-8 pt-6 pb-2">
        <div className={`relative bg-gradient-to-r ${slide.bg} overflow-hidden rounded-3xl transition-all duration-700 shadow-xl shadow-black/30 border border-white/5`}>
          {/* Decorative blobs */}
          <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-white/10 rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8 sm:py-12 flex items-center justify-between gap-8">
            {/* Left: text */}
            <div className="flex-1 min-w-0 z-10">
              <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest bg-white/15 px-3 py-1 rounded-full border border-white/10">
                {slide.tag}
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight mt-4 mb-2">
                {slide.title}{" "}
                <span className="text-yellow-300 italic">{slide.accent}</span>
              </h2>
              <p className="text-white/75 text-sm sm:text-base mt-2 mb-6 max-w-md">{slide.subtitle}</p>
              <ul className="space-y-1.5 mb-8 hidden md:block">
                {slide.perks.map((perk) => (
                  <li key={perk} className="text-white/80 text-sm flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block animate-ping" />
                    {perk}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-7 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${slide.btnClass}`}
              >
                {slide.btnText}
              </button>
            </div>

            {/* Right: stacked food images */}
            <div className="hidden sm:flex items-end gap-3 flex-shrink-0 select-none pb-2 z-10">
              {slide.images.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt="food"
                  className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-2xl shadow-2xl border-4 border-white/10 transition-transform duration-300 hover:scale-105"
                  style={{
                    transform: `rotate(${(i - 1) * 6}deg) translateY(${i === 1 ? -12 : 0}px)`,
                    zIndex: i === 1 ? 10 : 5,
                    position: "relative",
                  }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ))}
            </div>
          </div>

          {/* Prev / Next arrows */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-xl p-2 transition-all hover:scale-110 active:scale-90 border border-white/5"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-xl p-2 transition-all hover:scale-110 active:scale-90 border border-white/5"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentSlide ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-transparent px-4 sm:px-6 md:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search for burgers, pasta, pizza..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/5 focus:outline-none text-white text-sm bg-white/5 focus:bg-white/10 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="glass-panel sticky top-16 z-30 shadow-[0_4px_30px_rgba(0,0,0,0.25)] border-y border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 flex gap-3 overflow-x-auto scrollbar-none">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-[#0a0f1e] shadow-lg shadow-orange-500/20"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div id="products-section" className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-md">
                <div className="skeleton h-44 w-full" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3.5 w-1/2" />
                  <div className="flex justify-between items-center mt-4">
                    <div className="skeleton h-6 w-1/3" />
                    <div className="skeleton h-9 w-9 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-72">
            <p className="text-gray-500 text-6xl mb-4">🍽️</p>
            <p className="text-white text-xl font-bold">No products found!</p>
            <p className="text-gray-400 text-sm mt-2">Try a different search query or select another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
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
