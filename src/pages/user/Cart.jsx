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

  return (<>
     <div className="w-full bg-background min-h-screen p-8">
  <div className="p-4 sm:p-8 max-w-4xl mx-auto">
    {cart.length === 0 ? (
      <p className="text-center text-gray-500">Your cart is empty.</p>
    ) : (
      <div>
        {cart.map(item => (
          <div
            key={item?.id}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4 border rounded-lg p-4 shadow-sm bg-white"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded"
            />

            {/* Item Info */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold text-base sm:text-lg">{item.name}</h3>
              <p className="text-gray-600">${(item.price||0).toFixed(2)}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-center sm:justify-end gap-2 flex-shrink-0">
              <button
                onClick={() => dispatch(decreaseQuantity(item.id))}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                -
              </button>
              <span className="mx-2 font-medium">{(item.quantity||0)}</span>
              <button
                onClick={() => increaseQty(item)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                +
              </button>
            </div>
          </div>
        ))}

        <div className="mt-6 font-bold text-xl text-right">
          Total: ${totalPrice.toFixed(2)}
        </div>
      </div>
    )}
  </div>
</div>

    </>
  );
};

export default Cart;
