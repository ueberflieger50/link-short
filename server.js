require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const db = require("better-sqlite3")("links.db");
const app = express();
const port = 3001;

db.exec(`CREATE TABLE IF NOT EXISTS "links" (
	"id"	TEXT NOT NULL UNIQUE,
	"link"	TEXT NOT NULL,
	"uses"	INTEGER,
	PRIMARY KEY("id")
);`);
db.exec(`CREATE TABLE IF NOT EXISTS "users" (
	"id"	INTEGER NOT NULL UNIQUE,
	"username"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
    "role"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);`);

function newId(id) {
  if (!id) {
    id = Math.random().toString(36).slice(2, 8);
  }
  if (db.prepare(`SELECT id FROM links WHERE id=?`).get(id) !== undefined) {
    return newId();
  } else {
    return id;
  }
}

app.use("/", express.static(__dirname + "/public"));
app.use(express.json());

// ======================= User Authentication ============================
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/isloggedin', (req, res) => {
  if(req.isAuthenticated() && req.user.role === "admin") {
    res.send([true, req.user.username]);
  } else {
    res.send(false);
  }
});

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (username) => {
    let usernames = db.prepare(`SELECT * FROM users WHERE username =  ?`).get(username);
    return usernames;
  },
  (id) => {
    let userById = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id);
    return userById;
  }
);

function checkNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.sendStatus(403);
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  return res.sendStatus(401);
}

app.post("/register", checkNotAuthenticated, async (req, res) => {
const usernames = db.prepare(`SELECT username FROM users`).all();
if(usernames.length < 1) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      if (db.prepare(`SELECT * FROM users LIMIT 1`).all().length > 0) {
        db.prepare(
          `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`
        ).run(req.body.username, hashedPassword, "user");
      } else {
        db.prepare(
          `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`
        ).run(req.body.username, hashedPassword, "admin");
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
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local"),
  (req, res) => {
    res.sendStatus(202);
  }
);

app.delete('/logout', (req, res) => {
    req.logOut();
    res.sendStatus(200);
});

// ========================================================================

// ======================= Api Routes =====================================
app.get("/:id", (req, res) => {
  if (req.params.id === "robots.txt") res.send("");
  const redirect = db
    .prepare(`SELECT link FROM links WHERE id=?`)
    .get(req.params.id);
  if (redirect === undefined) {
    res.redirect("/");
  } else {
    db.prepare(`UPDATE links SET uses = uses + 1 where id=?`).run(
      req.params.id
    );
    res.redirect(redirect.link);
  }
});

app.post("/api/new", (req, res) => {
  const id = newId(req.body.customId);
  const linkdb = db
    .prepare(`SELECT id FROM links WHERE link=?`)
    .get(req.body.newUrl);
  if (linkdb !== undefined) {
    res.send(id);
  } else {
    db.prepare(`INSERT INTO links (id, link, uses) VALUES (?, ?, ?)`).run(
      id,
      req.body.newUrl,
      0
    );
    res.send(id);
  }
});

function sendAllLinks() {
  const data = db.prepare(`SELECT * FROM links;`).all();
  return data;
}

app.delete("/api/remove/:id", checkAuthenticated, (req, res) => {
  db.prepare(`DELETE FROM links WHERE id=?`).run(req.params.id);
  res.send(sendAllLinks());
});

app.get("/api/all", checkAuthenticated, (req, res) => {
  res.send(sendAllLinks());
});

// ========================================================================

app.listen(port, () => {
  console.log(`🔗 Link Shortener listening at http://localhost:${port}`);
});
