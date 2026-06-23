import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart, fetchCart } from '../../redux/cartSlice';
import { createPaymentIntent, createOrder, getDeliveryFee } from '../../services/api';
import toast from 'react-hot-toast';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '350px',
  borderRadius: '0.75rem',
};

const defaultCenter = {
  lat: 25.2048,
  lng: 55.2708, // Dubai, UAE
};

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalPrice, loading } = useSelector(state => state.cart);
  const [orderLoading, setOrderLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [savedAddress, setSavedAddress] = useState(null);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [deliveryFee, setDeliveryFee] = useState(5);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState(30);

  const fetchDeliveryFee = async (lat, lng) => {
    try {
      const res = await getDeliveryFee(lat, lng);
      if (res.data) {
        setDeliveryFee(res.data.fee);
        setEstimatedDeliveryTime(res.data.estimatedTime);
      }
    } catch (err) {
      console.error('Failed to fetch delivery fee:', err);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || '',
  });

  const handleGeocode = (lat, lng) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const addressComponents = results[0].address_components;
        let streetNumber = '';
        let route = '';
        let neighborhood = '';
        let sublocality = '';
        let city = '';
        let state = '';

        addressComponents.forEach(component => {
          const types = component.types;
          if (types.includes('street_number')) {
            streetNumber = component.long_name;
          } else if (types.includes('route')) {
            route = component.long_name;
          } else if (types.includes('neighborhood')) {
            neighborhood = component.long_name;
          } else if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
            sublocality = component.long_name;
          } else if (types.includes('locality')) {
            city = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            state = component.long_name;
          }
        });

        const streetParts = [streetNumber, route, neighborhood || sublocality].filter(Boolean);
        const streetAddress = streetParts.length > 0 ? streetParts.join(' ') : results[0].formatted_address;

        setValue('street', streetAddress, { shouldValidate: true });
        if (city) {
          setValue('city', city, { shouldValidate: true });
        }

        const emiratesList = [
          'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Fujairah',
          'Ras Al Khaimah', 'Umm Al Quwain'
        ];
        const matchedEmirate = emiratesList.find(e => 
          state.toLowerCase().includes(e.toLowerCase()) || 
          e.toLowerCase().includes(state.toLowerCase())
        );
        if (matchedEmirate) {
          setValue('emirate', matchedEmirate, { shouldValidate: true });
        }
        toast.success('Address auto-filled from map! 📍');
      } else {
        console.warn('Geocoding status:', status);
        toast.error('Could not auto-resolve address. Please fill in details manually.');
      }
    });
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newLoc = { lat, lng };
    setSelectedLocation(newLoc);
    handleGeocode(lat, lng);
    fetchDeliveryFee(lat, lng);
  };

  const handleMarkerDragEnd = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newLoc = { lat, lng };
    setSelectedLocation(newLoc);
    handleGeocode(lat, lng);
    fetchDeliveryFee(lat, lng);
  };

  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(userPos);
          setSelectedLocation(userPos);
          handleGeocode(userPos.lat, userPos.lng);
          fetchDeliveryFee(userPos.lat, userPos.lng);
        },
        (error) => {
          toast.error('Could not get current location. Please pick on map manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

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
      await createPaymentIntent({ amount: totalPrice + deliveryFee });

      const orderData = {
        items: items.map(item => ({
          product: item.product._id || item.product,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: totalPrice + deliveryFee,
        deliveryAddress: `${savedAddress.street}, ${savedAddress.city}, ${savedAddress.emirate}`,
        paymentMethod: 'card',
        isPaid: true,
        deliveryLat: selectedLocation?.lat,
        deliveryLng: selectedLocation?.lng,
        deliveryFee,
        estimatedDeliveryTime,
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
    <div className="min-h-screen bg-[#0a0f1e] py-10 px-4 text-white">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <h2 className="text-2xl font-extrabold mb-8 flex items-center gap-2">
          🛒 Checkout
        </h2>

        {/* Steps Progress */}
        <div className="flex items-center mb-10 bg-white/5 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
          <div className={`flex items-center gap-3 ${step >= 1 ? 'text-orange-400' : 'text-gray-500'}`}>
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black transition-all ${step >= 1 ? 'bg-gradient-to-tr from-orange-500 to-yellow-500 text-[#0a0f1e] shadow-lg shadow-orange-500/20' : 'bg-white/5 text-gray-500'}`}>1</span>
            <span className="font-bold text-xs uppercase tracking-wider">Delivery Address</span>
          </div>
          <div className="flex-1 h-0.5 mx-4 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-500 ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
          </div>
          <div className={`flex items-center gap-3 ${step >= 2 ? 'text-orange-400' : 'text-gray-500'}`}>
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black transition-all ${step >= 2 ? 'bg-gradient-to-tr from-orange-500 to-yellow-500 text-[#0a0f1e] shadow-lg shadow-orange-500/20' : 'bg-white/5 text-gray-500'}`}>2</span>
            <span className="font-bold text-xs uppercase tracking-wider">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left */}
          <div className="md:col-span-2">

            {/* Step 1: Address */}
            {step === 1 && (
              <div className="bg-white/5 border border-white/5 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">📍 Delivery Address</h3>
                <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">

                  {/* Google Maps Location Picker */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📍 Pin your delivery location on the map (Optional)
                    </label>
                    {loadError && (
                      <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-sm mb-4">
                        ❌ Error loading Google Maps. Please enter your address manually.
                      </div>
                    )}
                    {!isLoaded && !loadError && (
                      <div className="w-full h-[350px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center mb-4 border border-gray-200">
                        <p className="text-gray-400 font-semibold flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading Google Maps...
                        </p>
                      </div>
                    )}
                    {isLoaded && !loadError && (
                      <div className="mb-4">
                        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-inner">
                          <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={mapCenter}
                            zoom={12}
                            onClick={handleMapClick}
                            options={{
                              fullscreenControl: false,
                              streetViewControl: false,
                              mapTypeControl: false,
                            }}
                          >
                            {selectedLocation && (
                              <MarkerF
                                position={selectedLocation}
                                draggable={true}
                                onDragEnd={handleMarkerDragEnd}
                              />
                            )}
                          </GoogleMap>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 justify-between mt-2">
                          <button
                            type="button"
                            onClick={locateUser}
                            className="flex items-center justify-center gap-2 px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-semibold rounded-lg transition"
                          >
                            🎯 Locate Me
                          </button>
                          <span className="text-[11px] text-gray-500 self-center">
                            Click anywhere on the map or drag the marker to pinpoint.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

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
                    className="w-full btn-glow text-white font-bold py-3.5 rounded-xl transition"
                  >
                    Continue to Payment →
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white/5 border border-white/5 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">💳 Payment</h3>

                <div className="bg-white/5 border border-white/5 rounded-xl p-4 mb-6">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Delivering to:</p>
                  <p className="font-semibold text-white mt-1">{savedAddress?.street}, {savedAddress?.city}, {savedAddress?.emirate}</p>
                  <p className="text-xs text-gray-400 mt-1">{savedAddress?.phone}</p>
                  <button onClick={() => setStep(1)} className="text-orange-400 text-xs mt-2 hover:underline font-bold">
                    Change Address
                  </button>
                </div>

                <div className="border border-orange-500/35 bg-orange-500/5 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💳</span>
                    <div>
                      <p className="font-bold text-white text-sm">Credit / Debit Card</p>
                      <p className="text-xs text-gray-400">Secure payment via Stripe</p>
                    </div>
                    <span className="ml-auto text-orange-400 font-black text-sm">✓</span>
                  </div>
                </div>

                <div className="bg-blue-900/25 border border-blue-800/30 text-blue-300 rounded-xl p-4 mb-6 text-xs">
                  <p className="font-bold text-blue-400 mb-2 uppercase tracking-wider">🧪 Test Card:</p>
                  <p className="text-gray-300">Card: <span className="font-mono font-bold text-white">4242 4242 4242 4242</span></p>
                  <p className="text-gray-300 mt-1">Expiry: <span className="font-mono font-bold text-white">12/34</span> &nbsp;&nbsp;&nbsp; CVV: <span className="font-mono font-bold text-white">123</span></p>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={orderLoading}
                  className="w-full btn-glow disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-3.5 rounded-xl transition"
                >
                  {orderLoading ? '⏳ Processing...' : `Pay AED ${(totalPrice + deliveryFee).toFixed(2)} 🔒`}
                </button>
              </div>
            )}
          </div>

          {/* Right — Order Summary */}
          <div className="bg-white/5 border border-white/5 rounded-2xl shadow-xl p-6 h-fit">
            <h3 className="text-lg font-bold mb-6 border-b border-white/5 pb-3">Order Summary</h3>
            <div className="space-y-4 mb-6">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="text-gray-400 font-semibold">{item.product?.name} × {item.quantity}</span>
                  <span className="font-bold text-white">AED {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 pt-4 space-y-3">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Subtotal</span>
                <span className="font-semibold text-white">AED {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Delivery</span>
                <span className={deliveryFee > 0 ? 'font-bold text-white' : 'text-green-400 font-bold'}>
                  {deliveryFee > 0 ? `AED ${deliveryFee.toFixed(2)}` : 'Free'}
                </span>
              </div>
              <div className="flex justify-between font-black text-lg border-t border-white/5 pt-3">
                <span>Total</span>
                <span className="text-orange-400">AED {(totalPrice + deliveryFee).toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;