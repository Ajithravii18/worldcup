import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import api from '../api/axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message || 'Password reset instructions sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col justify-center bg-app-bg px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-app-ink">
          Reset password
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-app-muted">
          Enter your email to receive a reset link
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-app bg-white px-6 py-8 shadow-card sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-xl bg-green-50 p-4 text-sm font-bold text-green-600">
                {message}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-app-ink">
                Email address
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-gray-300 pl-10 px-4 py-3 text-app-ink focus:border-app-primary focus:outline-none focus:ring-1 focus:ring-app-primary"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center items-center gap-2 rounded-xl bg-app-primary px-4 py-3 text-sm font-bold text-white shadow-soft hover:bg-app-secondary focus:outline-none focus:ring-2 focus:ring-app-primary focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
            
            <div className="text-center mt-4">
              <Link to="/login" className="inline-flex items-center gap-1 text-sm font-bold text-app-muted hover:text-app-primary">
                <ArrowLeft className="h-4 w-4" /> Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
