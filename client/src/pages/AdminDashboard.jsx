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
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-neon-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-24 pb-36 px-4 max-w-[1600px] mx-auto w-full relative z-10">
      <div className="bg-black/60 backdrop-blur-2xl rounded-3xl p-6 md:p-10 shadow-2xl border border-white/10">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/app')}
            className="flex items-center gap-2 text-xs font-display font-bold text-outline-variant hover:text-white transition-colors uppercase tracking-widest"
          >
            ← Back to App
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-black text-white tracking-widest uppercase drop-shadow-md">Admin Panel</h1>
            <p className="text-sm text-outline-variant font-display font-bold uppercase tracking-widest mt-1">Manage Users & Accounts</p>
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
              className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-full font-display font-bold text-xs uppercase tracking-widest border border-primary/50 transition-colors shadow-neon-primary"
            >
              Evaluate Points
            </button>
            <div className="bg-white/10 text-white px-4 py-2 rounded-full font-display font-bold text-xs uppercase tracking-widest border border-white/20">
              Total Users: {users.length}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-error/20 text-error-container p-4 rounded-2xl mb-6 text-sm font-bold border border-error/50 backdrop-blur-md">
            {error}
          </div>
        )}

        {/* Mobile View (Cards) */}
        <div className="md:hidden space-y-4">
          {users.map((u) => (
            <div key={u._id} className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-inner flex flex-col gap-3 backdrop-blur-md">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-display font-black text-white uppercase tracking-widest truncate max-w-[200px]">{u.name}</span>
                  <span className="text-xs text-outline-variant truncate max-w-[200px]">{u.email}</span>
                </div>
                <span className={`px-2 py-1 rounded border text-[10px] font-display font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-secondary/20 text-secondary border-secondary/50 shadow-[0_0_5px_rgba(0,255,135,0.3)]' : 'bg-white/5 text-outline-variant border-white/10'}`}>
                  {u.role}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-outline-variant font-display font-bold">{new Date(u.createdAt).toLocaleDateString()}</span>
                <span className={`px-2.5 py-1 rounded border text-[10px] font-display font-black uppercase tracking-widest ${u.isFrozen ? 'bg-error/20 text-error-container border-error/50' : 'bg-primary/20 text-primary border-primary/50'}`}>
                  {u.isFrozen ? 'Frozen' : 'Active'}
                </span>
              </div>
              
              <div className="flex gap-2 pt-3 border-t border-white/10 mt-2">
                <button
                  onClick={() => handleToggleFreeze(u._id)}
                  disabled={u.role === 'admin'}
                  className={`flex-1 text-[10px] font-display font-black uppercase tracking-widest px-3 py-2 rounded-lg transition-colors border ${u.isFrozen ? 'bg-primary/20 text-primary border-primary/50 hover:bg-primary/30' : 'bg-white/5 text-white border-white/20 hover:bg-white/10'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {u.isFrozen ? 'Unfreeze' : 'Freeze'}
                </button>
                <button
                  onClick={() => handleDeleteUser(u._id)}
                  disabled={u.role === 'admin'}
                  className="flex-1 text-[10px] font-display font-black uppercase tracking-widest px-3 py-2 rounded-lg bg-error/20 text-error-container border border-error/50 hover:bg-error/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="text-center text-outline-variant font-display font-black uppercase tracking-widest text-xs p-6 bg-white/5 rounded-xl border border-white/10">
              No users found
            </div>
          )}
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/10 shadow-inner bg-black/40 backdrop-blur-md">
          <table className="w-full text-left text-sm text-white">
            <thead className="bg-white/5 text-[10px] font-display font-black uppercase tracking-[0.2em] text-outline-variant border-b border-white/10">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-display font-black tracking-widest uppercase text-white truncate max-w-[150px]">{u.name}</span>
                      <span className="text-[10px] font-bold text-outline-variant truncate max-w-[150px]">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded border text-[10px] font-display font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-secondary/20 text-secondary border-secondary/50 shadow-[0_0_5px_rgba(0,255,135,0.3)]' : 'bg-white/5 text-outline-variant border-white/10'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-display font-bold text-outline-variant uppercase tracking-widest">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded border text-[10px] font-display font-black uppercase tracking-widest ${u.isFrozen ? 'bg-error/20 text-error-container border-error/50' : 'bg-primary/20 text-primary border-primary/50'}`}>
                      {u.isFrozen ? 'Frozen' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleFreeze(u._id)}
                      disabled={u.role === 'admin'}
                      className={`text-[10px] font-display font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-colors border ${u.isFrozen ? 'bg-primary/20 text-primary border-primary/50 hover:bg-primary/30' : 'bg-white/5 text-white border-white/20 hover:bg-white/10'} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {u.isFrozen ? 'Unfreeze' : 'Freeze'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      disabled={u.role === 'admin'}
                      className="text-[10px] font-display font-black uppercase tracking-widest px-4 py-2 rounded-lg bg-error/20 text-error-container border border-error/50 hover:bg-error/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-outline-variant font-display font-black uppercase tracking-widest text-xs">
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
