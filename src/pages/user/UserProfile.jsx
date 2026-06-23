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
    { label: 'Total Orders', value: orders.length, icon: <ShoppingBag size={20} />, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: '✅', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
    { label: 'Total Spent', value: `AED ${totalSpent.toFixed(2)}`, icon: '💰', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: '⏳', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1e] py-10 px-4 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center gap-5">
          <div className="skeleton w-20 h-20 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="skeleton h-6 w-1/4" />
            <div className="skeleton h-4 w-1/6" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-5 h-28 flex flex-col justify-between">
              <div className="skeleton h-6 w-8 rounded-lg" />
              <div className="skeleton h-4 w-3/4 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1e] py-10 px-4 text-white">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Profile Card */}
        <div className="bg-white/5 border border-white/5 rounded-3xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full">
              <div className="w-20 h-20 rounded-full border-2 border-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.25)] bg-orange-500/10 flex items-center justify-center shrink-0 overflow-hidden">
                {profile?.profileImage ? (
                  <img src={profile.profileImage} alt={profile.name} className="w-20 h-20 object-cover" />
                ) : (
                  <User size={36} className="text-orange-400" />
                )}
              </div>

              {editing ? (
                <div className="space-y-3 flex-1 w-full">
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Full name"
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="Phone number"
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                  <input
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="Delivery address"
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              ) : (
                <div className="text-center sm:text-left flex-1">
                  <h1 className="text-2xl font-black text-white">{profile?.name}</h1>
                  <span className="inline-block text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1.5">
                    {profile?.role}
                  </span>
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex items-center justify-center sm:justify-start gap-2.5 text-xs text-gray-300">
                      <Mail size={14} className="text-gray-500" />
                      {profile?.email}
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2.5 text-xs text-gray-300">
                      <Phone size={14} className="text-gray-500" />
                      {profile?.phone || <span className="text-gray-500 italic">No phone added</span>}
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2.5 text-xs text-gray-300">
                      <MapPin size={14} className="text-gray-500" />
                      {profile?.address || <span className="text-gray-500 italic">No address saved</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Edit / Save / Cancel buttons */}
            <div className="flex gap-2 shrink-0 w-full md:w-auto justify-center sm:justify-start">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 btn-glow text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition disabled:opacity-60"
                  >
                    <Check size={14} />
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-300 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition border border-white/5"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition border border-white/5"
                >
                  <Pencil size={14} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white/5 border border-white/5 rounded-2xl shadow-xl p-5 text-center flex flex-col items-center justify-center hover:border-white/10 transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl border ${stat.color} flex items-center justify-center mb-3 text-lg`}>
                {stat.icon}
              </div>
              <p className="text-xl font-black text-white">{stat.value}</p>
              <p className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white/5 border border-white/5 rounded-3xl shadow-xl p-6">
          <h2 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-3">Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="text-center text-gray-500 py-8 text-sm">No orders yet — go order something delicious! 🍔</p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div key={order._id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl transition hover:bg-white/5">
                  <div>
                    <p className="font-mono text-xs font-black text-gray-300">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1 font-semibold">
                      {order.items?.length} items · {new Date(order.createdAt).toLocaleDateString('en-AE')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-orange-400 text-sm">AED {order.totalPrice?.toFixed(2)}</p>
                    <span className={`inline-block text-[9px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider mt-1.5 ${
                      order.status === 'delivered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      order.status === 'pending'   ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                      order.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {order.status}
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
