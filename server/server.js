const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'data', 'books.json');

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const MESSAGES_FILE = path.join(__dirname, 'data', 'messages.json');
const CONV_FILE = path.join(__dirname, 'data', 'conversations.json');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

async function readBooks() {
	try {
		const raw = await fs.readFile(DB_FILE, 'utf8');
		return JSON.parse(raw || '[]');
	} catch (err) {
		return [];
	}
}

async function writeBooks(books) {
	await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
	await fs.writeFile(DB_FILE, JSON.stringify(books, null, 2), 'utf8');
}

async function readUsers() {
	try { const raw = await fs.readFile(USERS_FILE, 'utf8'); return JSON.parse(raw || '[]'); } catch (e) { return []; }
}
async function writeUsers(users) {
	await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
	await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

async function readMessages() {
	try { const raw = await fs.readFile(MESSAGES_FILE, 'utf8'); return JSON.parse(raw || '[]'); } catch (e) { return []; }
}
async function writeMessages(messages) {
	await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
	await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf8');
}

async function readConversations() {
	try { const raw = await fs.readFile(CONV_FILE, 'utf8'); return JSON.parse(raw || '[]'); } catch (e) { return []; }
}
async function writeConversations(convs) {
	await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
	await fs.writeFile(CONV_FILE, JSON.stringify(convs, null, 2), 'utf8');
}

const EXCHANGE_FILE = path.join(__dirname, 'data', 'exchanges.json');
async function readExchanges() {
    try { const raw = await fs.readFile(EXCHANGE_FILE, 'utf8'); return JSON.parse(raw || '[]'); } catch (e) { return []; }
}
async function writeExchanges(items) {
    await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
    await fs.writeFile(EXCHANGE_FILE, JSON.stringify(items, null, 2), 'utf8');
}

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
	const auth = req.headers.authorization;
	if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
	const token = auth.slice(7);
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.userId = decoded.id;
		next();
	} catch (err) {
		return res.status(401).json({ error: 'Invalid token' });
	}
}

// Auth endpoints
app.post('/api/signup', async (req, res) => {
	const { name, email, password } = req.body;
	if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });
	const users = await readUsers();
	if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already exists' });
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	const id = Date.now().toString(36) + Math.random().toString(36).slice(2,8);
	const user = { id, name, email, passwordHash: hash, bio: '', createdAt: new Date().toISOString() };
	users.push(user);
	await writeUsers(users);
	const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
	const safe = { id: user.id, name: user.name, email: user.email, bio: user.bio, createdAt: user.createdAt };
	res.json({ token, user: safe });
});

app.post('/api/login', async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
	const users = await readUsers();
	const user = users.find(u => u.email === email);
	if (!user) return res.status(400).json({ error: 'Invalid credentials' });
	const ok = await bcrypt.compare(password, user.passwordHash);
	if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
	const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
	const safe = { id: user.id, name: user.name, email: user.email, bio: user.bio, createdAt: user.createdAt };
	res.json({ token, user: safe });
});

app.get('/api/me', authMiddleware, async (req, res) => {
	const users = await readUsers();
	const user = users.find(u => u.id === req.userId);
	if (!user) return res.status(404).json({ error: 'Not found' });
	const safe = { id: user.id, name: user.name, email: user.email, bio: user.bio, createdAt: user.createdAt };
	res.json(safe);
});

app.get('/api/users', async (req, res) => {
	const users = await readUsers();
	res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email, bio: u.bio })));
});

// AI Help endpoint (uses OpenAI if OPENAI_API_KEY provided, else fallback)
app.post('/api/ai-help', async (req, res) => {
	const { question, userId } = req.body;
	if (!question) return res.status(400).json({ error: 'Missing question' });
	// If OPENAI_API_KEY present, call OpenAI Chat Completions
	const key = process.env.OPENAI_API_KEY;
	if (key) {
		try {
			const resp = await fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
				body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are BookLoop assistant. Help users with concise actionable advice.' }, { role: 'user', content: question }], max_tokens: 800 })
			});
			const data = await resp.json();
			const answer = data?.choices?.[0]?.message?.content || JSON.stringify(data);
			return res.json({ answer });
		} catch (e) {
			console.error('OpenAI call failed', e);
		}
	}
	// fallback simple rule-based responder
	const q = question.toLowerCase();
	let answer = "Sorry, I couldn't find an exact answer. Try checking your account > Profile or asking about books, exchanges, or chat issues.";
	if (q.includes('signup') || q.includes('register') || q.includes('create account')) answer = 'To create an account, click Sign Up, provide name, email and password. If email exists, use Sign In or reset password.';
	if (q.includes('chat') || q.includes('message')) answer = 'Private chat is available for exchanges: request a book to create a private conversation between you and the owner.';
	if (q.includes('server') || q.includes('deploy')) answer = 'This demo uses file-based storage; for production use a real DB (Postgres, MongoDB) and set an env `JWT_SECRET`.';
	return res.json({ answer });
});

// Conversations (private 1:1 between lender and receiver)
app.get('/api/conversations', authMiddleware, async (req, res) => {
	const convs = await readConversations();
	const messages = await readMessages();
	const users = await readUsers();
	// only return conversations where user is a participant
	const mine = convs.filter(c => c.participants.includes(req.userId)).map(c => {
		// find last message for this conv
		const last = messages.filter(m => m.conversationId === c.id).sort((a,b)=> a.createdAt < b.createdAt ? 1 : -1)[0] || null;
		const unread = (c.unread && c.unread[req.userId]) ? c.unread[req.userId] : 0;
		const participantObjs = c.participants.map(pid => {
			const u = users.find(x=>x.id===pid);
			return u ? { id: u.id, name: u.name, email: u.email } : { id: pid };
		});
		return { ...c, lastMessage: last, unreadCount: unread, participantsInfo: participantObjs };
	});
	res.json(mine);
});

app.post('/api/conversations', authMiddleware, async (req, res) => {
	const { otherUserId, bookId } = req.body;
	if (!otherUserId || !bookId) return res.status(400).json({ error: 'Missing otherUserId or bookId' });
	const users = await readUsers();
	const other = users.find(u => u.id === otherUserId);
	if (!other) return res.status(404).json({ error: 'User not found' });
	const books = await readBooks();
	const book = books.find(b => b.id === bookId);
	if (!book) return res.status(404).json({ error: 'Book not found' });
	const exchanges = await readExchanges();
	const hasRelationship = exchanges.some(e =>
		e.bookId === bookId &&
		((e.ownerId === req.userId && e.requesterId === otherUserId) ||
		 (e.requesterId === req.userId && e.ownerId === otherUserId))
	);
	if (!hasRelationship) {
		return res.status(403).json({ error: 'Start an exchange for this book to open a private chat.' });
	}
	const convs = await readConversations();
	const participants = [req.userId, otherUserId].sort();
	let conv = convs.find(c => c.participants.sort().join('|') === participants.join('|') && (c.bookId || '') === (bookId || ''));
	if (!conv) {
		const id = Date.now().toString(36) + Math.random().toString(36).slice(2,8);
		conv = { id, participants, bookId, createdAt: new Date().toISOString(), lastMessageAt: null, unread: {} };
		convs.push(conv);
		await writeConversations(convs);
	}
	res.json(conv);
});

app.get('/api/conversations/:id/messages', authMiddleware, async (req, res) => {
	const convId = req.params.id;
	const convs = await readConversations();
	const conv = convs.find(c => c.id === convId);
	if (!conv || !conv.participants.includes(req.userId)) return res.status(404).json({ error: 'Not found or access denied' });
	const messages = await readMessages();
	const msgs = messages.filter(m => m.conversationId === convId).sort((a,b)=> a.createdAt < b.createdAt ? -1 : 1);
	res.json(msgs);
});

app.post('/api/conversations/:id/messages', authMiddleware, async (req, res) => {
	const convId = req.params.id;
	const { text } = req.body;
	if (!text) return res.status(400).json({ error: 'Empty message' });
	const convs = await readConversations();
	const conv = convs.find(c => c.id === convId);
	if (!conv || !conv.participants.includes(req.userId)) return res.status(404).json({ error: 'Not found or access denied' });
	const messages = await readMessages();
	const id = Date.now().toString(36) + Math.random().toString(36).slice(2,8);
	const users = await readUsers();
	const u = users.find(x=>x.id===req.userId);
	const msg = { id, conversationId: convId, from: req.userId, fromName: u ? u.name : 'anon', text, createdAt: new Date().toISOString() };
	messages.push(msg);
	conv.lastMessageAt = msg.createdAt;
	// mark unread for the other participant
	conv.unread = conv.unread || {};
	conv.participants.forEach(p => { if (p !== req.userId) conv.unread[p] = (conv.unread[p]||0) + 1; });
	await writeMessages(messages);
	await writeConversations(convs);
	// emit to room
	io.to(convId).emit('conversationMessage', msg);
	res.status(201).json(msg);
});

// Mark conversation as read for current user
app.put('/api/conversations/:id/read', authMiddleware, async (req, res) => {
	const convId = req.params.id;
	const convs = await readConversations();
	const conv = convs.find(c => c.id === convId);
	if (!conv || !conv.participants.includes(req.userId)) return res.status(404).json({ error: 'Not found or access denied' });
	conv.unread = conv.unread || {};
	conv.unread[req.userId] = 0;
	await writeConversations(convs);
	res.json({ success: true });
});

// Favorites endpoints: toggle favorite and list favorites for authenticated user
app.post('/api/users/favorite', authMiddleware, async (req, res) => {
  const { bookId } = req.body;
  if (!bookId) return res.status(400).json({ error: 'Missing bookId' });
  const users = await readUsers();
  const idx = users.findIndex(u => u.id === req.userId);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  users[idx].favorites = users[idx].favorites || [];
  const exists = users[idx].favorites.includes(bookId);
  if (exists) users[idx].favorites = users[idx].favorites.filter(b => b !== bookId);
  else users[idx].favorites.push(bookId);
  await writeUsers(users);
  res.json({ favorites: users[idx].favorites });
});

app.get('/api/users/favorites', authMiddleware, async (req, res) => {
  const users = await readUsers();
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const favs = user.favorites || [];
  const books = await readBooks();
  const favBooks = books.filter(b => favs.includes(b.id));
  res.json(favBooks);
});

// Update profile (name, bio)
app.put('/api/users/:id', authMiddleware, async (req, res) => {
	const id = req.params.id;
	if (id !== req.userId) return res.status(403).json({ error: 'Forbidden' });
	const { name, bio } = req.body;
	const users = await readUsers();
	const idx = users.findIndex(u => u.id === id);
	if (idx === -1) return res.status(404).json({ error: 'Not found' });
	if (name) users[idx].name = name;
	if (bio !== undefined) users[idx].bio = bio;
	await writeUsers(users);
	const u = users[idx];
	res.json({ id: u.id, name: u.name, email: u.email, bio: u.bio, createdAt: u.createdAt });
});

// Exchanges (request/accept/decline)
app.post('/api/exchanges', authMiddleware, async (req, res) => {
	const { bookId, message } = req.body;
	if (!bookId) return res.status(400).json({ error: 'Missing bookId' });
	const books = await readBooks();
	const book = books.find(b => b.id === bookId);
	if (!book) return res.status(404).json({ error: 'Book not found' });
	if (book.ownerId === req.userId) return res.status(400).json({ error: 'Cannot request your own book' });
	const exchanges = await readExchanges();
	const id = Date.now().toString(36) + Math.random().toString(36).slice(2,8);
	const ex = { id, bookId, requesterId: req.userId, ownerId: book.ownerId, message: message || '', status: 'requested', createdAt: new Date().toISOString() };
	exchanges.push(ex);
	await writeExchanges(exchanges);
	// create or get conversation for these users about this book
	const convs = await readConversations();
	const participants = [req.userId, book.ownerId].sort();
	let conv = convs.find(c => c.participants.sort().join('|') === participants.join('|') && c.bookId === bookId);
	if (!conv) {
		const cid = Date.now().toString(36) + Math.random().toString(36).slice(2,8);
		conv = { id: cid, participants, bookId, createdAt: new Date().toISOString(), lastMessageAt: null, unread: {} };
		convs.push(conv);
		await writeConversations(convs);
	}
	// notify owner via socket (direct user room)
	io.to(ex.ownerId).emit('exchangeRequest', ex);
	res.status(201).json({ exchange: ex, conversation: conv });
});

app.get('/api/exchanges', authMiddleware, async (req, res) => {
	const exchanges = await readExchanges();
	// return where user is requester or owner
	const mine = exchanges.filter(e => e.requesterId === req.userId || e.ownerId === req.userId);
	res.json(mine);
});

app.put('/api/exchanges/:id/accept', authMiddleware, async (req, res) => {
	const id = req.params.id;
	const exchanges = await readExchanges();
	const idx = exchanges.findIndex(e => e.id === id);
	if (idx === -1) return res.status(404).json({ error: 'Not found' });
	const ex = exchanges[idx];
	if (ex.ownerId !== req.userId) return res.status(403).json({ error: 'Only owner can accept' });
	if (ex.status !== 'requested') return res.status(400).json({ error: 'Invalid status' });
	ex.status = 'accepted';
	ex.acceptedAt = new Date().toISOString();
	await writeExchanges(exchanges);
	// update book status
	const books = await readBooks();
	const bidx = books.findIndex(b => b.id === ex.bookId);
	if (bidx !== -1) { books[bidx].status = 'reserved'; await writeBooks(books); }
	// notify requester
	io.to(ex.requesterId).emit('exchangeAccepted', ex);
	res.json(ex);
});

app.put('/api/exchanges/:id/decline', authMiddleware, async (req, res) => {
	const id = req.params.id;
	const exchanges = await readExchanges();
	const idx = exchanges.findIndex(e => e.id === id);
	if (idx === -1) return res.status(404).json({ error: 'Not found' });
	const ex = exchanges[idx];
	if (ex.ownerId !== req.userId) return res.status(403).json({ error: 'Only owner can decline' });
	if (ex.status !== 'requested') return res.status(400).json({ error: 'Invalid status' });
	ex.status = 'declined';
	ex.declinedAt = new Date().toISOString();
	await writeExchanges(exchanges);
	io.to(ex.requesterId).emit('exchangeDeclined', ex);
	res.json(ex);
});

// GET /api/books
app.get('/api/books', async (req, res) => {
	const books = await readBooks();
	// sort by createdAt desc
	books.sort((a, b) => (b.createdAt || '') > (a.createdAt || '') ? 1 : -1);
	res.json(books);
});

// Socket.io realtime
io.on('connection', (socket) => {
	// allow clients to identify themselves (send token) so server can join user-specific room
	socket.on('identify', (token) => {
		try {
			if (!token) return;
			const decoded = jwt.verify(token.replace(/^Bearer\s+/i, ''), JWT_SECRET);
			if (decoded && decoded.id) {
				socket.join(decoded.id);
			}
		} catch (e) { /* ignore invalid token */ }
	});
	socket.on('join', () => { /* can be extended */ });
	// room-based messages for private convos
	socket.on('joinConversation', (convId) => {
		try { socket.join(convId); } catch(e){}
	});
	socket.on('leaveConversation', (convId) => {
		try { socket.leave(convId); } catch(e){}
	});
	socket.on('sendConversationMessage', async (payload) => {
		try {
			const { token, text, conversationId } = payload || {};
			if (!text || !conversationId) return;
			let userId = null, fromName = 'anon';
			if (token) {
				try { const decoded = jwt.verify(token, JWT_SECRET); userId = decoded.id; const users = await readUsers(); const u = users.find(x=>x.id===userId); if (u) fromName = u.name; } catch(e) {}
			}
			const convs = await readConversations();
			const conv = convs.find(c => c.id === conversationId);
			if (!conv) return;
			// only participants can send
			if (userId && !conv.participants.includes(userId)) return;
			const messages = await readMessages();
			const id = Date.now().toString(36) + Math.random().toString(36).slice(2,8);
			const msg = { id, conversationId, from: userId || 'anon', fromName, text, createdAt: new Date().toISOString() };
			messages.push(msg);
			conv.lastMessageAt = msg.createdAt;
			conv.unread = conv.unread || {};
			conv.participants.forEach(p => { if (p !== userId) conv.unread[p] = (conv.unread[p]||0) + 1; });
			await writeMessages(messages);
			await writeConversations(convs);
			io.to(conversationId).emit('conversationMessage', msg);
		} catch (e) { console.error('socket sendConversationMessage error', e); }
	});
});

// POST /api/books
app.post('/api/books', async (req, res) => {
	const { title, author, genre, condition, location, imageUrl, ownerId } = req.body;
	if (!title || !author) return res.status(400).json({ error: 'Missing title/author' });

	const books = await readBooks();
	const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
	const newBook = {
		id,
		title,
		author,
		genre: genre || 'General',
		condition: condition || 'Good',
		location: location || 'Remote',
		imageUrl: imageUrl || '',
		ownerId: ownerId || 'anon',
		status: 'available',
		createdAt: new Date().toISOString()
	};
	books.push(newBook);
	await writeBooks(books);
	res.status(201).json(newBook);
});

// PUT /api/books/:id
app.put('/api/books/:id', async (req, res) => {
	const id = req.params.id;
	const updates = req.body;
	const books = await readBooks();
	const idx = books.findIndex(b => b.id === id);
	if (idx === -1) return res.status(404).json({ error: 'Not found' });
	books[idx] = { ...books[idx], ...updates };
	await writeBooks(books);
	res.json(books[idx]);
});

// DELETE /api/books/:id
app.delete('/api/books/:id', async (req, res) => {
	const id = req.params.id;
	let books = await readBooks();
	const before = books.length;
	books = books.filter(b => b.id !== id);
	if (books.length === before) return res.status(404).json({ error: 'Not found' });
	await writeBooks(books);
	res.json({ success: true });
});

// Serve client build if present
const clientDist = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
	// If the request looks like an API request, skip
	if (req.path.startsWith('/api/')) return next();
	// Serve index.html from client build if available
	const indexHtml = path.join(clientDist, 'index.html');
	fs.access(indexHtml).then(() => res.sendFile(indexHtml)).catch(() => res.status(404).end());
});

server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
