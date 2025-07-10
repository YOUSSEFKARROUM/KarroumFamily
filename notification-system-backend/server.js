require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Server } = require('socket.io');
const http = require('http');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('Erreur MongoDB:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now }
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

// Post Schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 }
}, { timestamps: true });
const Post = mongoose.model('Post', postSchema);

// Notification Schema
const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['like', 'comment', 'follow', 'message'], required: true },
  entityType: { type: String, enum: ['post', 'comment', 'user'], required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const Notification = mongoose.model('Notification', notificationSchema);

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requis' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide' });
    req.user = user;
    next();
  });
}

// Socket.IO Auth
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    socket.userId = user._id.toString();
    socket.username = user.username;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO Connection
io.on('connection', async (socket) => {
  await User.findByIdAndUpdate(socket.userId, { isOnline: true, lastSeen: new Date() });
  socket.join(socket.userId);
  const unreadCount = await Notification.countDocuments({ recipient: socket.userId, isRead: false });
  socket.emit('unreadCount', unreadCount);
  socket.on('disconnect', async () => {
    await User.findByIdAndUpdate(socket.userId, { isOnline: false, lastSeen: new Date() });
  });
});

// Helper: Create/send notification
async function createAndSendNotification(recipientId, senderId, type, entityType, entityId, message) {
  const notification = new Notification({ recipient: recipientId, sender: senderId, type, entityType, entityId, message });
  await notification.save();
  await notification.populate('sender', 'username avatar');
  io.to(recipientId.toString()).emit('newNotification', notification);
  const unreadCount = await Notification.countDocuments({ recipient: recipientId, isRead: false });
  io.to(recipientId.toString()).emit('unreadCount', unreadCount);
  return notification;
}

// AUTH ROUTES
app.post('/api/auth/register', [
  body('username').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) return res.status(400).json({ error: 'Utilisateur déjà existant' });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.status(201).json({ message: 'Utilisateur créé', token, user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Utilisateur non trouvé' });
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(400).json({ error: 'Mot de passe incorrect' });
  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ message: 'Connexion réussie', token, user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar } });
});

// USER ROUTES
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

app.get('/api/users', authenticateToken, async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user.id } }).select('username avatar isOnline lastSeen').limit(20);
  res.json(users);
});

// POST ROUTES
app.post('/api/posts', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  const post = new Post({ title, content, author: req.user.id });
  await post.save();
  await post.populate('author', 'username avatar');
  res.status(201).json(post);
});

app.get('/api/posts', authenticateToken, async (req, res) => {
  const posts = await Post.find().populate('author', 'username avatar').sort({ createdAt: -1 }).limit(20);
  res.json(posts);
});

// LIKE ROUTES
app.post('/api/posts/:id/like', authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const post = await Post.findById(postId).populate('author', 'username');
  if (!post) return res.status(404).json({ error: 'Post non trouvé' });
  const isLiked = post.likes.includes(userId);
  if (isLiked) {
    post.likes.pull(userId);
    post.likesCount = Math.max(0, post.likesCount - 1);
  } else {
    post.likes.push(userId);
    post.likesCount += 1;
    if (post.author._id.toString() !== userId) {
      await createAndSendNotification(post.author._id, userId, 'like', 'post', postId, `${req.user.username} a aimé votre post "${post.title}"`);
    }
  }
  await post.save();
  res.json({ isLiked: !isLiked, likesCount: post.likesCount, message: isLiked ? 'Like retiré' : 'Post aimé' });
});

app.get('/api/posts/:id/like-status', authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ error: 'Post non trouvé' });
  const isLiked = post.likes.includes(userId);
  res.json({ isLiked, likesCount: post.likesCount });
});

// NOTIFICATION ROUTES
app.get('/api/notifications', authenticateToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const notifications = await Notification.find({ recipient: req.user.id }).populate('sender', 'username avatar').sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await Notification.countDocuments({ recipient: req.user.id });
  const unreadCount = await Notification.countDocuments({ recipient: req.user.id, isRead: false });
  res.json({ notifications, pagination: { page, limit, total, pages: Math.ceil(total / limit) }, unreadCount });
});

app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  const notification = await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user.id }, { isRead: true }, { new: true });
  if (!notification) return res.status(404).json({ error: 'Notification non trouvée' });
  const unreadCount = await Notification.countDocuments({ recipient: req.user.id, isRead: false });
  io.to(req.user.id).emit('unreadCount', unreadCount);
  res.json(notification);
});

app.put('/api/notifications/mark-all-read', authenticateToken, async (req, res) => {
  await Notification.updateMany({ recipient: req.user.id, isRead: false }, { isRead: true });
  io.to(req.user.id).emit('unreadCount', 0);
  res.json({ message: 'Toutes les notifications marquées comme lues' });
});

app.delete('/api/notifications/:id', authenticateToken, async (req, res) => {
  const notification = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user.id });
  if (!notification) return res.status(404).json({ error: 'Notification non trouvée' });
  res.json({ message: 'Notification supprimée' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 