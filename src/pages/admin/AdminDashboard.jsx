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
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-orange-500 text-xl font-bold">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
              <div className={`${stat.light} p-3 rounded-xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="py-3 font-mono text-xs text-gray-600">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-3 text-gray-700">
                        {order.user?.name || 'Customer'}
                      </td>
                      <td className="py-3 text-gray-600">
                        {order.items?.length} items
                      </td>
                      <td className="py-3 font-semibold text-orange-500">
                        AED {order.totalPrice?.toFixed(2)}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status?.toUpperCase()}
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