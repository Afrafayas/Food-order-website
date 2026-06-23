import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, addToCart, removeFromCart, clearCart, decreaseQuantity } from "../../redux/cartSlice";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalPrice, loading } = useSelector(state => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = (item) => {
    if (!item?.product) return;
    dispatch(removeFromCart(item.product._id || item.product));
    toast.success('Item removed!');
  };

  const handleAddMore = (item) => {
    if (!item?.product) return;
    dispatch(addToCart({
      productId: item.product._id || item.product,
      quantity: 1,
      price: item.price,
    }));
  };

  const handleDecrease = (item) => {
    if (!item?.product) return;
    dispatch(decreaseQuantity(item.product._id || item.product));
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast.error('Cart is empty!');
      return;
    }
    navigate('/user-panel/checkout');
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (loading) return (
    <div className="fixed inset-0 z-50 bg-[#0a0f1e]/80 backdrop-blur-md flex justify-end">
      <div className="w-full sm:w-[500px] h-full bg-[#10162d] border-l border-white/5 shadow-2xl flex flex-col p-6 justify-center items-center">
        <svg className="animate-spin h-8 w-8 text-orange-500 mb-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-400 text-sm font-semibold">Loading Cart...</p>
      </div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#0a0f1e]/80 backdrop-blur-md flex justify-end"
      onClick={handleClose}
    >
      <div 
        className="w-full sm:w-[500px] h-full bg-[#10162d] border-l border-white/5 shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🛒 Your Cart
          </h2>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition border border-white/5"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20 text-center">
            <p className="text-gray-500 text-5xl mb-4">🛒</p>
            <p className="text-gray-400 text-base font-semibold">Your cart is empty!</p>
            <p className="text-gray-500 text-xs mt-1">Go add some delicious food 🍔</p>
            <button
              onClick={handleClose}
              className="mt-6 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              Back to Menu
            </button>
          </div>
        ) : (
          <div className="flex flex-col flex-1 justify-between h-full">
            {/* Items List */}
            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  {/* Image */}
                  <img
                    src={item.product?.image || '/no-image.jpg'}
                    alt={item.product?.name || 'Product'}
                    className="w-16 h-16 object-cover rounded-xl border border-white/5"
                    onError={(e) => { e.target.src = '/no-image.jpg'; }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">
                      {item.product?.name || 'Product'}
                    </h3>
                    <p className="text-orange-400 font-extrabold text-xs mt-0.5">
                      AED {(item.price || 0).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecrease(item)}
                      className="bg-white/5 hover:bg-white/10 text-white border border-white/5 w-7 h-7 rounded-lg flex items-center justify-center transition font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm min-w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleAddMore(item)}
                      className="bg-white/5 hover:bg-white/10 text-white border border-white/5 w-7 h-7 rounded-lg flex items-center justify-center transition font-bold"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemove(item)}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 w-7 h-7 rounded-lg flex items-center justify-center transition ml-1"
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-8 border-t border-white/5 pt-6 bg-transparent">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Order Summary</h3>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-gray-400 text-xs">
                  <span>Items ({items.length})</span>
                  <span className="font-semibold text-white">AED {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs">
                  <span>Delivery</span>
                  <span className="text-green-400 font-bold">Free</span>
                </div>
                <div className="border-t border-white/5 pt-3 flex justify-between font-black text-lg text-white">
                  <span>Total</span>
                  <span className="text-orange-400">AED {totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full btn-glow text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all"
              >
                Proceed to Checkout →
              </button>

              <button
                onClick={() => dispatch(clearCart())}
                className="w-full mt-2.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition border border-white/5"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;