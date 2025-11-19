import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { booksApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useNotification } from '../context/NotificationContext';

const initialState = {
  title: '',
  author: '',
  genre: 'Fiction',
  condition: 'Good',
  location: '',
  imageUrl: '',
};

const AddBook = () => {
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token, user } = useAuth();
  const { refreshBooks } = useAppData();
  const { notify } = useNotification();

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      await booksApi.create({ ...form, ownerId: user?.id }, token);
      notify('Book published!', 'success');
      setForm(initialState);
      refreshBooks();
    } catch (err) {
      notify(err.message || 'Unable to add book.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <SectionHeading
        eyebrow="New Listing"
        title="Share a book with the community"
        description="Listings go live instantly and can be edited anytime."
        align="left"
      />
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <label className="text-sm text-slate-700">
            <span>Book title</span>
            <input
              required
              value={form.title}
              onChange={(event) => update('title', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            />
          </label>
          <label className="text-sm text-slate-700">
            <span>Author</span>
            <input
              required
              value={form.author}
              onChange={(event) => update('author', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            />
          </label>
          <label className="text-sm text-slate-700">
            <span>Genre</span>
            <select
              value={form.genre}
              onChange={(event) => update('genre', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            >
              <option>Fiction</option>
              <option>Non-Fiction</option>
              <option>Sci-Fi</option>
              <option>Biography</option>
              <option>Mystery</option>
              <option>Textbook</option>
            </select>
          </label>
          <label className="text-sm text-slate-700">
            <span>Condition</span>
            <select
              value={form.condition}
              onChange={(event) => update('condition', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            >
              <option>New</option>
              <option>Like New</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Poor</option>
            </select>
          </label>
          <label className="text-sm text-slate-700">
            <span>City / Location</span>
            <input
              required
              value={form.location}
              onChange={(event) => update('location', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            />
          </label>
          <label className="text-sm text-slate-700">
            <span>Cover image URL</span>
            <input
              value={form.imageUrl}
              onChange={(event) => update('imageUrl', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              placeholder="https://"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <PlusCircle className="h-4 w-4" />
          Publish listing
        </button>
      </form>
    </div>
  );
};

export default AddBook;

