const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

const Staff = require('./models/staff');
const UserCred = require('./models/userCred');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/med_secure';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('Connected to MongoDB'))
	.catch(err => console.error('MongoDB connection error:', err));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'change-this-secret',
	resave: false,
	saveUninitialized: false,
}));

app.get('/', (req, res) => {
	res.render('login', { message: null });
});

app.post('/login', async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await UserCred.findOne({ email });
		if (!user) return res.render('login', { message: 'Invalid credentials' });
		const ok = await bcrypt.compare(password, user.password);
		if (!ok) return res.render('login', { message: 'Invalid credentials' });
		req.session.userId = user._id;
		res.redirect('/dashboard');
	} catch (err) {
		console.error(err);
		res.render('login', { message: 'An error occurred' });
	}
});

app.get('/signup', (req, res) => {
	res.render('signup', { message: null });
});

app.post('/signup', async (req, res) => {
	const { email, password, confirm } = req.body;
	if (!email || !password || password !== confirm) {
		return res.render('signup', { message: 'Password mismatch or missing fields' });
	}
	try {
		const staff = await Staff.findOne({ email });
		if (!staff) return res.render('signup', { message: "user doesnot exists cant signup" });
		const existing = await UserCred.findOne({ email });
		if (existing) return res.render('signup', { message: 'Account already exists, please login' });
		const hash = await bcrypt.hash(password, 10);
		await UserCred.create({ email, password: hash });
		res.render('login', { message: 'Account created. Please login.' });
	} catch (err) {
		console.error(err);
		res.render('signup', { message: 'An error occurred' });
	}
});

app.get('/forgot', (req, res) => {
	res.render('forgot', { message: null });
});

app.post('/forgot', async (req, res) => {
	const { email, currentPassword, newPassword, confirmPassword } = req.body;
	if (!email || !currentPassword || !newPassword || newPassword !== confirmPassword) {
		return res.render('forgot', { message: 'failed to change, check again!' });
	}
	try {
		const user = await UserCred.findOne({ email });
		if (!user) return res.render('forgot', { message: 'failed to change, check again!' });
		const ok = await bcrypt.compare(currentPassword, user.password);
		if (!ok) return res.render('forgot', { message: 'failed to change, check again!' });
		const hash = await bcrypt.hash(newPassword, 10);
		user.password = hash;
		await user.save();
		res.render('login', { message: 'Password changed. Please login.' });
	} catch (err) {
		console.error(err);
		res.render('forgot', { message: 'failed to change, check again!' });
	}
});

app.get('/dashboard', async (req, res) => {
	if (!req.session.userId) return res.redirect('/');
	const user = await UserCred.findById(req.session.userId).lean();
	res.render('dashboard', { email: user.email });
});

app.get('/logout', (req, res) => {
	req.session.destroy(() => res.redirect('/'));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
