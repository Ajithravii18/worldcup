import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorBanner } from '../components/ErrorBanner';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/app');
      return;
    }

    const fetchMatches = async () => {
      try {
        const res = await api.get('/matches');
        setMatches(res.data);
      } catch (err) {
        setError('Failed to load matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user, navigate]);

  const updateMatch = async (matchId, status, homeScore, awayScore) => {
    try {
      await api.put(`/matches/${matchId}/result`, {
        status,
        homeScore: parseInt(homeScore) || 0,
        awayScore: parseInt(awayScore) || 0,
      });
      alert('Match updated successfully');
      setMatches((prev) => prev.map((m) => m._id === matchId ? { ...m, status, homeScore, awayScore } : m));
    } catch (err) {
      alert('Failed to update match');
    }
  };

  if (loading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 pb-12">
      <header>
        <p className="text-sm font-bold text-app-primary">Management</p>
        <h1 className="text-3xl font-black text-app-ink">Admin Dashboard</h1>
      </header>

      {error && <ErrorBanner message={error} />}

      <div className="space-y-4">
        {matches.map((match) => (
          <div key={match._id} className="rounded-app bg-white p-5 shadow-card ring-1 ring-slate-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-app-muted">{match.group || 'Group Stage'}</span>
              <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-500">{match.status}</span>
            </div>
            
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1">
                <p className="font-bold">{match.homeTeam}</p>
                <input 
                  type="number" 
                  defaultValue={match.homeScore} 
                  id={`home-${match._id}`}
                  className="w-full mt-2 p-2 rounded-lg border border-slate-200" 
                />
              </div>
              <div className="text-lg font-black text-slate-300">VS</div>
              <div className="flex-1">
                <p className="font-bold">{match.awayTeam}</p>
                <input 
                  type="number" 
                  defaultValue={match.awayScore} 
                  id={`away-${match._id}`}
                  className="w-full mt-2 p-2 rounded-lg border border-slate-200" 
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <select 
                id={`status-${match._id}`} 
                defaultValue={match.status}
                className="flex-1 p-2 rounded-lg border border-slate-200 font-bold text-sm"
              >
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
              
              <button 
                onClick={() => {
                  const h = document.getElementById(`home-${match._id}`).value;
                  const a = document.getElementById(`away-${match._id}`).value;
                  const s = document.getElementById(`status-${match._id}`).value;
                  updateMatch(match._id, s, h, a);
                }}
                className="bg-app-primary text-white font-bold px-4 rounded-lg shadow-soft"
              >
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
