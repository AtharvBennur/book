import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { aiApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const AIAssistant = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const { notify } = useNotification();

  const ask = async (event) => {
    event.preventDefault();
    if (!question.trim()) return;
    setIsLoading(true);
    try {
      const data = await aiApi.ask(question, token);
      setAnswer(data.answer || 'No answer received, try again.');
    } catch (err) {
      notify(err.message || 'Assistant unavailable, please retry.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-emerald-600">
        <Sparkles className="h-4 w-4" />
        Ask the librarian
      </div>
      <p className="mt-2 text-sm text-slate-600">
        Troubleshooting an exchange or looking for your next genre? Ask a question and get an instant
        answer.
      </p>
      <form className="mt-4 space-y-3" onSubmit={ask}>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="e.g. “How do I mark a swap as completed?”"
          className="min-h-[90px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Ask AI
        </button>
      </form>
      {answer && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          {answer}
        </div>
      )}
    </section>
  );
};

export default AIAssistant;

