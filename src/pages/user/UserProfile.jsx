import { useEffect, useState } from 'react';
import { getMe, updateProfile, getMyOrders } from '../../services/api';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../redux/authSlice';
import { User, Mail, Phone, MapPin, ShoppingBag, Pencil, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { user: authUser } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [meRes, ordersRes] = await Promise.all([getMe(), getMyOrders()]);
        setProfile(meRes.data);
        setForm({ name: meRes.data.name || '', phone: meRes.data.phone || '', address: meRes.data.address || '' });
        setOrders(ordersRes.data);
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateProfile(form);
      setProfile(res.data);
      dispatch(updateUser({ name: res.data.name, phone: res.data.phone, address: res.data.address }));
      setEditing(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: profile.name || '', phone: profile.phone || '', address: profile.address || '' });
    setEditing(false);
  };

  const totalSpent = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: <ShoppingBag size={18} />, color: 'bg-orange-100 text-orange-600' },
    { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: '✅', color: 'bg-green-100 text-green-600' },
    { label: 'Total Spent', value: `AED ${totalSpent.toFixed(2)}`, icon: '💰', color: 'bg-blue-100 text-blue-600' },
    { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: '⏳', color: 'bg-yellow-100 text-yellow-600' },
  ];

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-orange-500 text-xl font-bold animate-pulse">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                {profile?.profileImage ? (
                  <img src={profile.profileImage} alt={profile.name} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <User size={36} className="text-orange-500" />
                )}
              </div>

              {editing ? (
                <div className="space-y-2 flex-1">
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Full name"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="Phone number"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <input
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="Delivery address"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{profile?.name}</h1>
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">
                    {profile?.role?.toUpperCase()}
                  </span>
                  <div className="flex flex-col gap-1.5 mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={14} className="text-gray-400" />
                      {profile?.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} className="text-gray-400" />
                      {profile?.phone || <span className="text-gray-400 italic">Not set</span>}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={14} className="text-gray-400" />
                      {profile?.address || <span className="text-gray-400 italic">Not set</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Edit / Save / Cancel buttons */}
            <div className="flex gap-2 shrink-0">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-60"
                  >
                    <Check size={15} />
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold transition"
                  >
                    <X size={15} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition"
                >
                  <Pencil size={15} />
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl shadow-sm p-4 text-center">
              <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center mx-auto mb-2 text-lg`}>
                {stat.icon}
              </div>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No orders yet — go order something delicious! 🍔</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map(order => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-mono text-xs font-bold text-gray-700">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {order.items?.length} items · {new Date(order.createdAt).toLocaleDateString('en-AE')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-500 text-sm">AED {order.totalPrice?.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending'   ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
