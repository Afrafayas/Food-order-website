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

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-orange-500 text-xl font-bold">Loading...</p>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-100 px-4 sm:px-6 md:px-8 py-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🛒 Your Cart</h2>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 text-xl">Your cart is empty!</p>
            <p className="text-gray-400 text-sm mt-2">Add some delicious food 🍔</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-xl shadow-sm"
                >
                  {/* Image */}
                  <img
                    src={item.product?.image || '/no-image.jpg'}
                    alt={item.product?.name || 'Product'}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => { e.target.src = '/no-image.jpg'; }}
                  />

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-lg">
                      {item.product?.name || 'Product'}
                    </h3>
                    <p className="text-orange-500 font-bold">
                      AED {(item.price || 0).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDecrease(item)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      -
                    </button>
                    <span className="font-bold text-lg">{item.quantity}</span>
                    <button
                      onClick={() => handleAddMore(item)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemove(item)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg ml-2"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Items ({items.length})</span>
                <span>AED {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Delivery</span>
                <span className="text-green-500">Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-xl">
                <span>Total</span>
                <span className="text-orange-500">AED {totalPrice.toFixed(2)}</span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition"
              >
                Proceed to Checkout →
              </button>

              <button
                onClick={() => dispatch(clearCart())}
                className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-xl transition"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;