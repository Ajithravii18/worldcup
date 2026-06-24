import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleFreeze = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/freeze`);
      setUsers(users.map(u => 
        u._id === userId ? { ...u, isFrozen: res.data.isFrozen } : u
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to completely delete this user and all their predictions? This cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-theme-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-24 pb-36 px-4 max-w-7xl mx-auto w-full">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-xl border border-outline-variant/30">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/app')}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-theme-primary transition-colors uppercase tracking-widest"
          >
            ← Back to App
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Admin Panel</h1>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Manage Users & Accounts</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                try {
                  const res = await api.put('/admin/evaluate');
                  alert(res.data.message);
                } catch (err) {
                  alert(err.response?.data?.message || 'Failed to evaluate matches');
                }
              }}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest border border-blue-200 transition-colors shadow-sm"
            >
              Evaluate Points
            </button>
            <div className="bg-theme-primary/10 text-theme-primary px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest border border-theme-primary/20">
              Total Users: {users.length}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold border border-red-100">
            {error}
          </div>
        )}

        {/* Mobile View (Cards) */}
        <div className="md:hidden space-y-4">
          {users.map((u) => (
            <div key={u._id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 truncate max-w-[200px]">{u.name}</span>
                  <span className="text-xs text-gray-500 truncate max-w-[200px]">{u.email}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-theme-secondary/10 text-theme-secondary border border-theme-secondary/20' : 'bg-gray-100 text-gray-600'}`}>
                  {u.role}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-semibold">{new Date(u.createdAt).toLocaleDateString()}</span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.isFrozen ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-theme-primary/10 text-theme-primary border border-theme-primary/20'}`}>
                  {u.isFrozen ? 'Frozen' : 'Active'}
                </span>
              </div>
              
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleToggleFreeze(u._id)}
                  disabled={u.role === 'admin'}
                  className={`flex-1 text-xs font-bold px-3 py-2 rounded-lg transition-colors border ${u.isFrozen ? 'bg-theme-primary/10 text-theme-primary border-theme-primary/20 hover:bg-theme-primary/20' : 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {u.isFrozen ? 'Unfreeze' : 'Freeze'}
                </button>
                <button
                  onClick={() => handleDeleteUser(u._id)}
                  disabled={u.role === 'admin'}
                  className="flex-1 text-xs font-bold px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="text-center text-gray-500 font-semibold uppercase tracking-widest text-xs p-6 bg-white rounded-xl border border-gray-200">
              No users found
            </div>
          )}
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-50 text-xs uppercase font-black text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 truncate max-w-[150px]">{u.name}</span>
                      <span className="text-xs text-gray-500 truncate max-w-[150px]">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-theme-secondary/10 text-theme-secondary border border-theme-secondary/20' : 'bg-gray-100 text-gray-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.isFrozen ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-theme-primary/10 text-theme-primary border border-theme-primary/20'}`}>
                      {u.isFrozen ? 'Frozen' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleFreeze(u._id)}
                      disabled={u.role === 'admin'}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${u.isFrozen ? 'bg-theme-primary/10 text-theme-primary border-theme-primary/20 hover:bg-theme-primary/20' : 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {u.isFrozen ? 'Unfreeze' : 'Freeze'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      disabled={u.role === 'admin'}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 font-semibold uppercase tracking-widest text-xs">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
