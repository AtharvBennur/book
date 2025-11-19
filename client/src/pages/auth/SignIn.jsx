import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { notify } = useNotification();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      notify('Welcome back!', 'success');
      const destination = location.state?.from || '/browse';
      navigate(destination, { replace: true });
    } catch (err) {
      notify(err.message || 'Unable to sign in', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200">
      <h1 className="text-3xl font-bold text-slate-900">Sign in to BookLoop</h1>
      <p className="mt-2 text-sm text-slate-500">Access exchanges, favorites, and chat.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            required
          />
        </label>
        <label className="block text-sm text-slate-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            required
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sign in
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-500">
        Need an account?{' '}
        <Link className="font-semibold text-emerald-600" to="/auth/signup">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default SignIn;

