import { useState, useEffect } from 'react';
import api from '../api/axios';
import UserAvatar from './UserAvatar';
import { useAuth } from '../context/AuthContext';

export default function MatchComments({ matchId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, [matchId]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/matches/${matchId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setError('');

    try {
      const res = await api.post(`/matches/${matchId}/comments`, { text: newComment });
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
    }
  };


  return (
    <div className="mt-6 border-t border-outline-variant/30 pt-4">
      <div className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-3 font-bold text-center">
        MATCH BANTER 💬
      </div>

      {error && (
        <div className="text-error text-xs text-center mb-3 font-bold uppercase tracking-widest bg-error/10 py-2 border border-error/30 rounded">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handlePostComment} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Talk trash here..."
          className="flex-1 bg-surface-variant border border-outline-variant/30 text-sm px-3 py-2 rounded outline-none focus:border-primary transition-colors text-on-surface placeholder:text-on-surface-variant/50"
          maxLength={200}
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 transition-colors"
        >
          Post
        </button>
      </form>

      <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-none">
        {loading ? (
          <div className="text-center text-[10px] text-on-surface-variant font-bold uppercase tracking-widest py-4">Loading...</div>
        ) : comments.length === 0 ? (
          <div className="text-center text-[10px] text-on-surface-variant font-bold uppercase tracking-widest py-4 bg-surface-variant border border-outline-variant/20 rounded">
            No banter yet. Be the first!
          </div>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="flex items-start gap-3 bg-surface-variant border border-outline-variant/30 rounded px-3 py-2">
              <UserAvatar avatarId={c.user?.avatar} className="w-8 h-8 flex-shrink-0 text-xs border border-outline-variant/50 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-0.5">
                  <span className="text-xs font-bold text-on-surface truncate pr-2">{c.user?.name || 'Unknown'}</span>
                  <span className="text-[9px] text-on-surface-variant font-bold tracking-wider flex-shrink-0">
                    {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant break-words leading-snug">{c.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
