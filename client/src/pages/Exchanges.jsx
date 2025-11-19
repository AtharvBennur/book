import { useMemo } from 'react';
import { ArrowRightLeft, CheckCircle2, Clock, XCircle } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import EmptyState from '../components/common/EmptyState';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { exchangesApi } from '../services/api';
import { useNotification } from '../context/NotificationContext';

const Exchanges = () => {
  const { exchanges, refreshExchanges } = useAppData();
  const { token, user } = useAuth();
  const { notify } = useNotification();

  const pending = useMemo(() => exchanges.filter((item) => item.status === 'requested'), [exchanges]);

  const handleAction = async (exchangeId, action) => {
    try {
      if (action === 'accept') {
        await exchangesApi.accept(exchangeId, token);
        notify('Exchange accepted.', 'success');
      } else {
        await exchangesApi.decline(exchangeId, token);
        notify('Exchange declined.', 'info');
      }
      refreshExchanges();
    } catch (err) {
      notify(err.message || 'Unable to update exchange.', 'error');
    }
  };

  if (!exchanges.length) {
    return (
      <EmptyState
          title="No exchange activity yet"
          description="Request a book or wait for an interested reader to reach out."
          icon={<ArrowRightLeft className="h-10 w-10" />}
        />
    );
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Workflow"
        title="All exchange activity"
        description="Track who requested what, approve in one tap, and keep history for future reference."
        align="left"
      />
      <div className="mb-4 text-sm text-slate-500">
        {pending.length} pending approval • {exchanges.length - pending.length} completed
      </div>
      <div className="space-y-4">
        {exchanges.map((exchange) => {
          const isOwner = exchange.ownerId === user?.id;
          return (
            <div
              key={exchange.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-100"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Book #{exchange.bookId}
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    {exchange.requesterId.slice(0, 6)} ⇄ {exchange.ownerId.slice(0, 6)}
                  </p>
                  <p className="text-sm text-slate-500">{exchange.message || 'No message'}</p>
                </div>
                <StatusPill status={exchange.status} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <Clock className="h-4 w-4 text-slate-300" />
                {new Date(exchange.createdAt).toLocaleString()}
              </div>
              {isOwner && exchange.status === 'requested' && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleAction(exchange.id, 'accept')}
                    className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(exchange.id, 'decline')}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatusPill = ({ status }) => {
  const icons = {
    requested: <Clock className="h-4 w-4" />,
    accepted: <CheckCircle2 className="h-4 w-4" />,
    declined: <XCircle className="h-4 w-4" />,
  };
  const colors = {
    requested: 'bg-amber-50 text-amber-600 border border-amber-200',
    accepted: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    declined: 'bg-rose-50 text-rose-600 border border-rose-200',
  };
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${colors[status]}`}
    >
      {icons[status]}
      {status}
    </span>
  );
};

export default Exchanges;

