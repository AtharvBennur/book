import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const SignUp = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { notify } = useNotification();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await signup(form);
      notify('Account created!', 'success');
      navigate('/browse', { replace: true });
    } catch (err) {
      notify(err.message || 'Unable to create account', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200">
      <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
      <p className="mt-2 text-sm text-slate-500">List books, chat privately, and track exchanges.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm text-slate-700">
          Name
          <input
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            required
          />
        </label>
        <label className="block text-sm text-slate-700">
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            required
          />
        </label>
        <label className="block text-sm text-slate-700">
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            required
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sign up
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-500">
        Already have an account?{' '}
        <Link className="font-semibold text-emerald-600" to="/auth/signin">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignUp;

