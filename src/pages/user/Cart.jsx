import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, decreaseQuantity } from "../../redux/cartSlice";
import toast from 'react-hot-toast';

const Cart = () => {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const increaseQty = (item) => {
    if (item.quantity < item.count) {
      dispatch(addToCart(item));
    } else {
      toast.error('No more stock available');
    }
  };

  const totalPrice = cart.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0;
    const qty = item.quantity || 0;
    return acc + price * qty;
  }, 0);

  return (
   <div className="w-full min-h-screen bg-gray-100 px-4 sm:px-6 md:px-8">
  <div className="max-w-4xl mx-auto">
    {/* Cart content */}
        {cart.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div
                key={item?.id}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-white rounded-lg shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />

                {/* Item Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600">${(item.price || 0).toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    -
                  </button>
                  <span className="mx-2 font-medium">{item.quantity || 0}</span>
                  <button
                    onClick={() => increaseQty(item)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            {/* Total Price */}
            <div className="mt-6 text-right text-xl font-bold text-gray-800">
              Total: ${totalPrice.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
