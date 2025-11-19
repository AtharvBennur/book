import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { io as ioClient } from 'socket.io-client';
import { Send, MessageSquare } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import LoadingScreen from '../components/common/LoadingScreen';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { conversationsApi } from '../services/api';
import { useNotification } from '../context/NotificationContext';

const Chat = () => {
  const { token } = useAuth();
  const {
    conversations,
    refreshConversations,
    activeConversationId,
    setActiveConversationId,
  } = useAppData();
  const { state } = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const socketRef = useRef(null);
  const { notify } = useNotification();

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  // auto-open conversation from navigation state
  useEffect(() => {
    if (state?.conversationId) {
      setActiveConversationId(state.conversationId);
    }
  }, [state, setActiveConversationId]);

  const loadMessages = useCallback(
    async (conversationId) => {
      if (!conversationId || !token) return;
      setLoadingMessages(true);
      try {
        const data = await conversationsApi.messages(conversationId, token);
        setMessages(data);
        await conversationsApi.markRead(conversationId, token);
      } catch (err) {
        notify(err.message || 'Unable to load messages', 'error');
      } finally {
        setLoadingMessages(false);
      }
    },
    [token, notify]
  );

  useEffect(() => {
    loadMessages(activeConversationId);
  }, [activeConversationId, loadMessages]);

  useEffect(() => {
    if (!token) return undefined;
    const socket = ioClient(window.location.origin.replace(/:\d+$/, '') + ':5000');
    socketRef.current = socket;
    socket.emit('identify', token);
    socket.on('conversationMessage', (message) => {
      if (message.conversationId === activeConversationId) {
        setMessages((prev) => [...prev, message]);
      } else {
        refreshConversations();
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [token, activeConversationId, refreshConversations]);

  useEffect(() => {
    if (!socketRef.current) return undefined;
    if (activeConversationId) {
      socketRef.current.emit('joinConversation', activeConversationId);
      return () => {
        socketRef.current?.emit('leaveConversation', activeConversationId);
      };
    }
    return undefined;
  }, [activeConversationId]);

  const sendMessage = async () => {
    if (!input.trim() || !activeConversationId) return;
    setIsSending(true);
    try {
      if (socketRef.current?.connected) {
        socketRef.current.emit('sendConversationMessage', {
          token,
          text: input,
          conversationId: activeConversationId,
        });
      } else {
        await conversationsApi.sendMessage(activeConversationId, { text: input }, token);
      }
      setInput('');
    } catch (err) {
      notify(err.message || 'Unable to send message', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId),
    [conversations, activeConversationId]
  );

  if (!conversations.length) {
    return <LoadingScreen label="Start an exchange to unlock chat." />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow">
        <SectionHeading
          eyebrow="Inbox"
          title="Conversations"
          description="Every exchange has its own secure thread."
          align="left"
        />
        <div className="mt-4 space-y-3">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setActiveConversationId(conversation.id)}
              className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                conversation.id === activeConversationId
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                <span>Book #{conversation.bookId ?? 'general'}</span>
                {conversation.unreadCount > 0 && (
                  <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {conversation.participantsInfo
                  ?.map((participant) => participant.name || participant.id)
                  .join(', ')}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {conversation.lastMessage?.text || 'No messages yet'}
              </p>
            </button>
          ))}
        </div>
      </aside>
      <section className="flex flex-col rounded-3xl border border-slate-200 bg-white shadow">
        <div className="border-b border-slate-100 p-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {selectedConversation
              ? `Chat about ${selectedConversation.bookId ?? 'exchange'}`
              : 'Select a conversation'}
          </h3>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {loadingMessages ? (
              <LoadingScreen label="Loading messages…" />
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex flex-col gap-1 text-sm text-slate-600">
                  <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    {message.fromName} — {new Date(message.createdAt).toLocaleTimeString()}
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-2 shadow-sm">{message.text}</div>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4">
                <MessageSquare className="h-4 w-4 text-slate-400" />
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 bg-transparent py-3 text-sm text-slate-700 outline-none"
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!activeConversationId || isSending}
                className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 p-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Chat;

