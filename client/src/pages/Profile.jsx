import { useState } from 'react';
import { User } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [isSaving, setIsSaving] = useState(false);
  const { notify } = useNotification();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(form);
      notify('Profile updated.', 'success');
    } catch (err) {
      notify(err.message || 'Unable to save profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <SectionHeading
        eyebrow="Profile"
        title="Make it easier to trust you"
        description="Swap history, bios, and friendly photos help reassure other readers."
        align="left"
      />
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100"
      >
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-500">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-700">{user?.email}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Member since 2023</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <label className="block text-sm text-slate-700">
            Display name
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              required
            />
          </label>
          <label className="block text-sm text-slate-700">
            Bio
            <textarea
              value={form.bio}
              onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              rows={4}
              placeholder="Share favorite genres, availability, shipping preferences…"
            />
          </label>
        </div>
        <button
          disabled={isSaving}
          className="mt-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save profile
        </button>
      </form>
    </div>
  );
};

export default Profile;

