import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../../services/api';
import { ShoppingBag, Users, TrendingUp, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getAllOrders();
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  const stats = [
    {
      label: 'Total Orders',
      value: orders.length,
      icon: <ShoppingBag size={24} />,
      color: 'bg-orange-500',
      light: 'bg-orange-50 text-orange-600',
    },
    {
      label: 'Total Revenue',
      value: `AED ${totalRevenue.toFixed(2)}`,
      icon: <TrendingUp size={24} />,
      color: 'bg-green-500',
      light: 'bg-green-50 text-green-600',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      icon: <Clock size={24} />,
      color: 'bg-yellow-500',
      light: 'bg-yellow-50 text-yellow-600',
    },
    {
      label: 'Delivered',
      value: deliveredOrders,
      icon: <Users size={24} />,
      color: 'bg-blue-500',
      light: 'bg-blue-50 text-blue-600',
    },
  ];

  const recentOrders = orders.slice(0, 5);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'confirmed': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'delivered': return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1e] py-10 px-4 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 h-24 flex items-center gap-4">
              <div className="skeleton h-12 w-12 rounded-xl" />
              <div className="space-y-2 flex-1">
                <div className="skeleton h-3 w-1/2" />
                <div className="skeleton h-5 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1e] py-10 px-4 text-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/5 rounded-2xl shadow-xl p-6 flex items-center gap-4 hover:border-white/10 transition-all duration-300">
              <div className={`p-3.5 rounded-xl ${stat.light} border border-white/5 shadow-inner`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white/5 border border-white/5 rounded-3xl shadow-xl p-6">
          <h2 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-3">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8 text-sm">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-white/5 uppercase tracking-wider text-xs">
                    <th className="pb-4 font-bold">Order ID</th>
                    <th className="pb-4 font-bold">Customer</th>
                    <th className="pb-4 font-bold">Items</th>
                    <th className="pb-4 font-bold">Total</th>
                    <th className="pb-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-white/[0.01] transition duration-200">
                      <td className="py-4 font-mono text-xs text-gray-300">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-4 text-gray-200 font-semibold">
                        {order.user?.name || 'Customer'}
                      </td>
                      <td className="py-4 text-gray-400">
                        {order.items?.length} items
                      </td>
                      <td className="py-4 font-bold text-orange-400">
                        AED {order.totalPrice?.toFixed(2)}
                      </td>
                      <td className="py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;