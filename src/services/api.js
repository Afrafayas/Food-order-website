import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

API.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('auth'));
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const verifyOTP = (data) => API.post('/auth/verify-otp', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Products
export const getProducts = () => API.get('/products');
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Categories
export const getCategories = () => API.get('/categories');
export const createCategory = (data) => API.post('/categories', data);

// Cart
export const getCart = () => API.get('/cart');
export const addToCart = (data) => API.post('/cart', data);
export const decreaseCartItem = (productId) => API.put(`/cart/${productId}/decrease`);
export const removeFromCart = (productId) => API.delete(`/cart/${productId}`);
export const clearCart = () => API.delete('/cart');

export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my-orders');
export const getDeliveryFee = (lat, lng) => API.get(`/orders/delivery-fee?lat=${lat}&lng=${lng}`);
export const getAllOrders = () => API.get('/orders');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

// Users (Admin)
export const getAllUsers = () => API.get('/users');

// Payment
export const createPaymentIntent = (data) => API.post('/payment/create-payment-intent', data);

// Banners
export const getBanners = () => API.get('/banners');
export const createBanner = (data) => API.post('/banners', data);
export const deleteBanner = (id) => API.delete(`/banners/${id}`);

// Reviews
export const getReviews = (productId) => API.get(`/reviews/product/${productId}`);
export const createReview = (data) => API.post('/reviews', data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

// Wishlist
export const getWishlist = () => API.get('/wishlist');
export const toggleWishlist = (productId) => API.post(`/wishlist/${productId}`);
export const checkWishlist = (productId) => API.get(`/wishlist/${productId}/check`);

// Promo
export const validatePromo = (data) => API.post('/promo/validate', data);

// Offers
export const getActiveOffer = () => API.get('/offers/active');