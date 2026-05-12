import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart, fetchCart } from '../../redux/cartSlice';
import { createPaymentIntent, createOrder } from '../../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalPrice, loading } = useSelector(state => state.cart);
  const [orderLoading, setOrderLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [savedAddress, setSavedAddress] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Fetch cart on load
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const onAddressSubmit = (data) => {
    setSavedAddress(data);
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setOrderLoading(true);
    try {
      await createPaymentIntent({ amount: totalPrice });

      const orderData = {
        items: items.map(item => ({
          product: item.product._id || item.product,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice,
        deliveryAddress: `${savedAddress.street}, ${savedAddress.city}, ${savedAddress.emirate}`,
        paymentMethod: 'card',
        isPaid: true,
      };

      await createOrder(orderData);
      dispatch(clearCart());
      toast.success('Order placed successfully! 🎉');
      navigate('/user-panel/orders');

    } catch (err) {
      toast.error('Payment failed! Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  // Loading state
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-orange-500 text-xl font-bold">Loading...</p>
    </div>
  );

  // Empty cart redirect
  if (!loading && items.length === 0) {
    navigate('/user-panel/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🛒 Checkout</h2>

        {/* Steps */}
        <div className="flex items-center mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-orange-500' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>1</span>
            <span className="font-semibold">Delivery Address</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-200">
            <div className={`h-full bg-orange-500 transition-all duration-500 ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
          </div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-orange-500' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>2</span>
            <span className="font-semibold">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left */}
          <div className="md:col-span-2">

            {/* Step 1: Address */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📍 Delivery Address</h3>
                <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">

                  <div>
                    <input
                      {...register('street', {
                        required: 'Street address is required',
                        minLength: { value: 5, message: 'Address too short!' }
                      })}
                      placeholder="Street Address"
                      className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none ${errors.street ? 'border-red-400' : 'border-gray-200 focus:border-orange-400'}`}
                    />
                    {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>}
                  </div>

                  <div>
                    <input
                      {...register('city', {
                        required: 'City is required',
                        minLength: { value: 2, message: 'City name too short!' }
                      })}
                      placeholder="City"
                      className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none ${errors.city ? 'border-red-400' : 'border-gray-200 focus:border-orange-400'}`}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                  </div>

                  <div>
                    <select
                      {...register('emirate', { required: 'Please select an emirate' })}
                      className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none ${errors.emirate ? 'border-red-400' : 'border-gray-200 focus:border-orange-400'}`}
                    >
                      <option value="">Select Emirate</option>
                      <option>Abu Dhabi</option>
                      <option>Dubai</option>
                      <option>Sharjah</option>
                      <option>Ajman</option>
                      <option>Fujairah</option>
                      <option>Ras Al Khaimah</option>
                      <option>Umm Al Quwain</option>
                    </select>
                    {errors.emirate && <p className="text-red-500 text-sm mt-1">{errors.emirate.message}</p>}
                  </div>

                  <div>
                    <input
                      {...register('phone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9]{9,12}$/,
                          message: 'Invalid phone number! (9-12 digits)'
                        }
                      })}
                      placeholder="Phone Number (e.g. 0501234567)"
                      className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none ${errors.phone ? 'border-red-400' : 'border-gray-200 focus:border-orange-400'}`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition"
                  >
                    Continue to Payment →
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">💳 Payment</h3>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-500">Delivering to:</p>
                  <p className="font-semibold">{savedAddress?.street}, {savedAddress?.city}, {savedAddress?.emirate}</p>
                  <p className="text-sm text-gray-600">{savedAddress?.phone}</p>
                  <button onClick={() => setStep(1)} className="text-orange-500 text-sm mt-1 hover:underline">
                    Change Address
                  </button>
                </div>

                <div className="border-2 border-orange-400 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💳</span>
                    <div>
                      <p className="font-semibold">Credit / Debit Card</p>
                      <p className="text-sm text-gray-500">Secure payment via Stripe</p>
                    </div>
                    <span className="ml-auto text-orange-500 font-bold">✓</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 mb-6 text-sm">
                  <p className="font-semibold text-blue-700 mb-2">🧪 Test Card:</p>
                  <p>Card: <span className="font-mono font-bold">4242 4242 4242 4242</span></p>
                  <p>Expiry: <span className="font-mono font-bold">12/34</span></p>
                  <p>CVV: <span className="font-mono font-bold">123</span></p>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={orderLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition"
                >
                  {orderLoading ? '⏳ Processing...' : `Pay AED ${totalPrice.toFixed(2)} 🔒`}
                </button>
              </div>
            )}
          </div>

          {/* Right — Order Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
            <h3 className="text-lg font-bold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.product?.name} × {item.quantity}</span>
                  <span className="font-semibold">AED {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>AED {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-green-500 font-semibold">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-orange-500">AED {totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;