import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'confirmed': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'delivered': return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'pending': return 1;
      case 'confirmed': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1e] py-10 px-4 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="skeleton h-8 w-44" />
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between">
                <div className="space-y-2 w-1/3">
                  <div className="skeleton h-3 w-1/2" />
                  <div className="skeleton h-4 w-3/4" />
                </div>
                <div className="skeleton h-6 w-20 rounded-full" />
              </div>
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1e] py-10 px-4 text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-extrabold mb-8 flex items-center gap-2">📦 My Orders</h2>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white/5 border border-white/5 rounded-2xl shadow-xl">
            <p className="text-gray-400 text-6xl mb-3">📦</p>
            <p className="text-white text-xl font-bold">No orders yet!</p>
            <p className="text-gray-400 text-sm mt-1">Order some delicious comfort food 🍔</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white/5 border border-white/5 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:border-white/10">

                {/* Order Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Order ID:</p>
                    <p className="font-mono text-sm font-black text-gray-200 mt-0.5">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-2 mb-6 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span className="text-gray-300 font-semibold">
                        {item.product?.name || 'Product'} × {item.quantity}
                      </span>
                      <span className="font-bold text-white">
                        AED {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Progress Timeline */}
                {order.status !== 'cancelled' ? (
                  <div className="mt-8 mb-8 px-2">
                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-3">
                      <span className={getStepIndex(order.status) >= 1 ? "text-orange-400" : ""}>Order Placed</span>
                      <span className={getStepIndex(order.status) >= 2 ? "text-orange-400" : ""}>Preparing</span>
                      <span className={getStepIndex(order.status) >= 3 ? "text-orange-400" : ""}>Delivered</span>
                    </div>
                    <div className="relative w-full h-1 bg-white/5 rounded-full">
                      <div 
                        className="absolute h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(255,107,53,0.4)]" 
                        style={{ width: `${((getStepIndex(order.status) - 1) / 2) * 100}%` }}
                      />
                      <div className="absolute inset-0 flex justify-between -top-1.5">
                        {[1, 2, 3].map((step) => (
                          <div 
                            key={step} 
                            className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                              getStepIndex(order.status) >= step 
                                ? "bg-[#0a0f1e] border-orange-500 shadow-[0_0_8px_rgba(255,107,53,0.4)]" 
                                : "bg-gray-800 border-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 mb-6 bg-red-950/20 border border-red-900/30 text-red-400 rounded-xl p-3.5 text-xs font-semibold flex items-center gap-2">
                    ✕ This order was cancelled.
                  </div>
                )}

                {/* Order Footer */}
                <div className="border-t border-white/5 pt-4 mt-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <span>📍</span> {order.deliveryAddress}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <span>🕒</span> {new Date(order.createdAt).toLocaleDateString('en-AE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Amount</p>
                    <p className="font-black text-orange-400 text-xl mt-0.5">
                      AED {order.totalPrice.toFixed(2)}
                    </p>
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

export default Orders;  