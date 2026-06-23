import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../../services/api';
import axios from 'axios';
import toast from 'react-hot-toast';

const statusOptions = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-700';
    case 'confirmed': return 'bg-blue-100 text-blue-700';
    case 'preparing': return 'bg-purple-100 text-purple-700';
    case 'out_for_delivery': return 'bg-orange-100 text-orange-700';
    case 'delivered': return 'bg-green-100 text-green-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const auth = JSON.parse(localStorage.getItem('auth'));
      await axios.put(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o)
      );
      toast.success('Order status updated!');
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-orange-500 text-xl font-bold">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📦 Manage Orders</h1>
          <p className="text-gray-500 mt-1">View and update all customer orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', ...statusOptions].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                filter === s
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 border hover:border-orange-400'
              }`}
            >
              {s === 'all' ? `All (${orders.length})` : s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <p className="text-gray-400 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                  {/* Left */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-mono text-sm font-bold text-gray-700">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-semibold">
                      👤 {order.user?.name || 'Customer'} — {order.user?.email}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      📍 {order.deliveryAddress}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      🕒 {new Date(order.createdAt).toLocaleString('en-AE')}
                    </p>

                    {/* Items */}
                    <div className="mt-3 space-y-1">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.product?.name || 'Product'} × {item.quantity}
                          </span>
                          <span className="font-semibold text-gray-700">
                            AED {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end gap-3">
                    <p className="text-2xl font-bold text-orange-500">
                      AED {order.totalPrice?.toFixed(2)}
                    </p>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      disabled={updating === order._id}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 cursor-pointer"
                    >
                      {statusOptions.map(s => (
                        <option key={s} value={s}>
                          {s.replace('_', ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;