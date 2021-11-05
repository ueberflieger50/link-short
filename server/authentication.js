import express from 'express';
import passport from 'passport';
import session from 'express-session';
const db = require('better-sqlite3')('./server/data/data.db');
import bcrypt from 'bcrypt';
import utils from './functions';
const app = express();

app.use(
	session({
		// ! ONLY FOR EARLY DEVELOPMENT
		secret: 'DEV SECRET (DO NOT USE IN PRODUCTION)',
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 256000 },
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

const initializePassport = require('./passport-config');
initializePassport(
	passport,
	(username) => {
		const usernames = db
			.prepare(`SELECT * FROM users WHERE username =  ?`)
			.get(username);
		return usernames;
	},
	(id) => {
		const userById = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id);
		return userById;
	}
);

app.post('/register', utils.checkNotAuthenticated, async (req, res) => {
	const usernames = db
		.prepare(`SELECT username FROM users WHERE username = ?`)
		.get(req.body.username);
	if (usernames === undefined) {
		try {
			const hashedPassword = await bcrypt.hash(req.body.password, 10);
			if (db.prepare(`SELECT * FROM users LIMIT 1`).all().length > 0) {
				await db
					.prepare(
						`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`
					)
					.run(req.body.username, hashedPassword, 'user');
			} else {
				await db
					.prepare(
						`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`
					)
					.run(req.body.username, hashedPassword, 'initAdmin');
			}
			res.sendStatus(200);
		} catch (err) {
			console.warn(err);
			res.sendStatus(500);
		}
	} else {
		res.send('User already exists');
	}
});

app.post(
	'/login',
	utils.checkNotAuthenticated,
	passport.authenticate('local'),
	(req, res) => {
		res.sendStatus(202);
	}
);

app.get('/user', utils.checkAuthenticated, (req, res) => {
	res.json({ user: { username: req.user.username, role: req.user.role } });
});

app.delete('/logout', utils.checkAuthenticated, (req, res) => {
	req.logout();
	res.sendStatus(200);
});

module.exports = app;
