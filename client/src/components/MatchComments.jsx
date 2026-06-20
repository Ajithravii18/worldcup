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

  const hasCommented = user && comments.some(c => {
    const commentUserId = typeof c.user === 'object' ? c.user?._id : c.user;
    return commentUserId === user._id || commentUserId === user.id;
  });

  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-bold text-center">
        MATCH BANTER 💬
      </div>

      {error && (
        <div className="text-red-400 text-xs text-center mb-3 font-bold uppercase tracking-widest bg-red-500/10 py-2 border border-red-500/20">
          ⚠️ {error}
        </div>
      )}

      {!hasCommented ? (
        <form onSubmit={handlePostComment} className="flex gap-2 mb-4 px-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Talk trash here..."
            className="flex-1 bg-gray-50 border border-gray-200 text-sm px-3 py-2 outline-none focus:border-theme-primary transition-colors text-gray-800"
            maxLength={200}
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="bg-theme-secondary hover:bg-theme-primary text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 transition-colors"
          >
            Post
          </button>
        </form>
      ) : (
        <div className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest py-3 mb-4 bg-gray-50 border border-gray-200">
          You have already commented on this match.
        </div>
      )}

      <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar px-2">
        {loading ? (
          <div className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest py-4">Loading...</div>
        ) : comments.length === 0 ? (
          <div className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest py-4 bg-gray-50 border border-gray-200">
            No banter yet. Be the first!
          </div>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="flex items-start gap-3 bg-gray-50 border border-gray-200 px-3 py-2">
              <UserAvatar avatarId={c.user?.avatar} className="w-8 h-8 flex-shrink-0 text-xs border border-gray-300 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-0.5">
                  <span className="text-xs font-bold text-gray-900 truncate pr-2">{c.user?.name || 'Unknown'}</span>
                  <span className="text-[9px] text-gray-400 font-bold tracking-wider flex-shrink-0">
                    {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 break-words">{c.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
