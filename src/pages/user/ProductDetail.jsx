import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProduct, getReviews, createReview,
  toggleWishlist, checkWishlist,
} from '../../services/api';
import { addToCart } from '../../redux/cartSlice';
import {
  Star, Heart, ShoppingCart, Minus, Plus,
  Tag, Package, ChevronLeft, Send,
} from 'lucide-react';
import dummyImage from '../../assets/no-image.jpg';
import toast from 'react-hot-toast';

const Stars = ({ value, onChange, size = 20 }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(n => (
      <button
        key={n}
        type="button"
        onClick={() => onChange?.(n)}
        className={onChange ? 'cursor-pointer' : 'cursor-default'}
      >
        <Star
          size={size}
          className={n <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
        />
      </button>
    ))}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const { products } = useSelector(s => s.products);

  const [product, setProduct]     = useState(null);
  const [reviews, setReviews]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [qty, setQty]             = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);

  // Review form
  const [rating, setRating]     = useState(5);
  const [comment, setComment]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          getProduct(id),
          getReviews(id),
        ]);
        setProduct(prodRes.data);
        setReviews(revRes.data);
      } catch {
        toast.error('Product not found');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && id) {
      checkWishlist(id).then(r => setInWishlist(r.data)).catch(() => {});
    }
  }, [id, isAuthenticated]);

  const handleAddToCart = () => {
    if (!isAuthenticated) return navigate('/login');
    if (qty > product.stock) return toast.error('Not enough stock!');
    dispatch(addToCart({ productId: product._id, quantity: qty, price: product.price }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) return navigate('/login');
    setWishLoading(true);
    try {
      await toggleWishlist(id);
      setInWishlist(prev => !prev);
      toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist ❤️');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setWishLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error('Please write a comment');
    setSubmitting(true);
    try {
      const res = await createReview({ productId: id, rating, comment });
      setReviews(prev => [res.data, ...prev]);
      setComment('');
      setRating(5);
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const related = products
    .filter(p => p._id !== id && p.category?.name === product?.category?.name)
    .slice(0, 4);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading product…</p>
      </div>
    </div>
  );

  if (!product) return null;

  const {
    name, image, description, price, originalPrice,
    discountPercent, isOnSale, dealTag, stock, category,
  } = product;

  const outOfStock = stock === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-gray-500 hover:text-orange-500 text-sm font-medium mb-6 transition"
        >
          <ChevronLeft size={18} /> Back
        </button>

        {/* ── Main card ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

            {/* Image */}
            <div className="relative bg-gray-100 min-h-[280px] sm:min-h-[380px]">
              <img
                src={image || dummyImage}
                onError={e => { e.target.src = dummyImage; }}
                alt={name}
                className="w-full h-full object-cover"
                style={{ minHeight: '280px' }}
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {dealTag && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {dealTag}
                  </span>
                )}
                {isOnSale && discountPercent > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                disabled={wishLoading}
                className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition ${
                  inWishlist ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart size={18} className={inWishlist ? 'fill-white' : ''} />
              </button>

              {outOfStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-full text-sm">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {/* Category */}
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-500 uppercase tracking-wider mb-2">
                  <Tag size={12} /> {category?.name || '—'}
                </span>

                {/* Name */}
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-3">
                  {name}
                </h1>

                {/* Rating */}
                {avgRating && (
                  <div className="flex items-center gap-2 mb-4">
                    <Stars value={Math.round(avgRating)} size={16} />
                    <span className="text-sm font-bold text-gray-700">{avgRating}</span>
                    <span className="text-sm text-gray-400">({reviews.length} reviews)</span>
                  </div>
                )}

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  {description || 'No description available.'}
                </p>

                {/* Stock */}
                <div className="flex items-center gap-2 mb-5">
                  <Package size={14} className={outOfStock ? 'text-red-400' : 'text-green-500'} />
                  {outOfStock ? (
                    <span className="text-red-500 text-sm font-semibold">Out of Stock</span>
                  ) : stock <= 5 ? (
                    <span className="text-orange-500 text-sm font-semibold">Only {stock} left!</span>
                  ) : (
                    <span className="text-green-600 text-sm font-semibold">In Stock</span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-black text-orange-500">AED {price}</span>
                  {isOnSale && originalPrice && (
                    <span className="text-gray-400 text-lg line-through">AED {originalPrice}</span>
                  )}
                </div>
              </div>

              {/* Qty + Actions */}
              <div className="space-y-3">
                {/* Quantity */}
                {!outOfStock && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 font-medium">Qty:</span>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        className="px-3 py-2 hover:bg-gray-100 text-gray-600 transition"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="px-4 py-2 font-bold text-gray-800 min-w-[40px] text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(q => Math.min(stock, q + 1))}
                        className="px-3 py-2 hover:bg-gray-100 text-gray-600 transition"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={outOfStock}
                    className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition text-sm sm:text-base"
                  >
                    <ShoppingCart size={18} />
                    {outOfStock ? 'Unavailable' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={handleWishlist}
                    disabled={wishLoading}
                    className={`flex items-center justify-center px-4 py-3 rounded-xl border-2 transition ${
                      inWishlist
                        ? 'border-red-400 bg-red-50 text-red-500'
                        : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'
                    }`}
                  >
                    <Heart size={18} className={inWishlist ? 'fill-red-500' : ''} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Reviews ── */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Review list */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              Customer Reviews
              {avgRating && (
                <span className="ml-2 text-orange-500">{avgRating} ★</span>
              )}
            </h2>
            <p className="text-sm text-gray-400 mb-5">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>

            {reviews.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">
                No reviews yet — be the first!
              </p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {reviews.map(r => (
                  <div key={r._id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                          {r.user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {r.user?.name || 'User'}
                        </span>
                      </div>
                      <Stars value={r.rating} size={13} />
                    </div>
                    <p className="text-sm text-gray-600 ml-10">{r.comment}</p>
                    <p className="text-xs text-gray-400 ml-10 mt-1">
                      {new Date(r.createdAt).toLocaleDateString('en-AE')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add review */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Leave a Review</h2>
            {!isAuthenticated ? (
              <div className="text-center py-6">
                <p className="text-gray-400 text-sm mb-3">Login to leave a review</p>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-orange-500 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition"
                >
                  Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Your Rating</label>
                  <Stars value={rating} onChange={setRating} size={24} />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Comment</label>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={4}
                    placeholder="Share your experience…"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm transition"
                >
                  <Send size={15} />
                  {submitting ? 'Submitting…' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">
              More from <span className="text-orange-500">{category?.name}</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(p => (
                <button
                  key={p._id}
                  onClick={() => { navigate(`/user-panel/product/${p._id}`); window.scrollTo(0, 0); }}
                  className="text-left group bg-gray-50 hover:bg-orange-50 rounded-xl overflow-hidden border border-gray-100 hover:border-orange-200 transition"
                >
                  <img
                    src={p.image || dummyImage}
                    onError={e => { e.target.src = dummyImage; }}
                    alt={p.name}
                    className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-2.5">
                    <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                    <p className="text-orange-500 font-bold text-sm mt-0.5">AED {p.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;
