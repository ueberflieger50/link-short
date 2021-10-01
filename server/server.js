require("dotenv").config({ path: "../.env" });
const path = require('path');
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const db = require("better-sqlite3")("links.db");
const app = express();
const port = 3000;

const functions = require("./functions");

db.exec(`CREATE TABLE IF NOT EXISTS "users" (
  "id"	INTEGER NOT NULL UNIQUE,
  "username"	TEXT NOT NULL,
  "password"	TEXT NOT NULL,
    "role"	TEXT NOT NULL,
  PRIMARY KEY("id" AUTOINCREMENT)
);`);
db.exec(`CREATE TABLE IF NOT EXISTS "links" (
	"id"	TEXT NOT NULL UNIQUE,
	"link"	TEXT NOT NULL,
	"uses"	INTEGER,
	"owner"	TEXT,
	PRIMARY KEY("id"),
  FOREIGN KEY (owner) REFERENCES users(id) -- Hmmm something will come here
);`);

app.use(express.json());

// app.get("/*", (req, res) => {
//   if (req.isAuthenticated() && req.user.role === "admin") {
//     res.sendFile(path.resolve("/../public/default/index.html");
//   } else if (req.isAuthenticated()) {
//     res.sendFile(path.resolve("/../public/default/index.html");
//   } else {
//     res.sendFile(path.resolve("/../public/default/index.html");
//   }
// });

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

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (username) => {
    let usernames = db
      .prepare(`SELECT * FROM users WHERE username =  ?`)
      .get(username);
    return usernames;
  },
  (id) => {
    let userById = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id);
    return userById;
  }
);

const authentication = require("./authentication");
app.use("/auth", authentication);

// ========================================================================
app.use(function (req, res, next) {
  if (req.isAuthenticated()) {
    console.log("✔️ Request authenticated");
  } else {
    console.log("❌ Not authenticated");
  }
  console.log(req.user);
  next();
});

app.get('/', (req, res) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
   res.sendFile(path.resolve("../public/admin/index.html"));
  }else if (req.isAuthenticated()) {
    res.sendFile(path.resolve("../public/secure/index.html"));
  } else {
    res.sendFile(path.resolve("../public/default/index.html"));
  }
});
app.get('/main.js', (req, res) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
   res.sendFile(path.resolve("../public/admin/main.js"));
  }else if (req.isAuthenticated()) {
    res.sendFile(path.resolve("../public/secure/main.js"));
  } else {
    res.sendFile(path.resolve("../public/default/main.js"));
  }
});
app.use("/static", express.static(path.resolve("../static")));
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

const api = require("./api");
app.use("/api", api);

// ========================================================================

app.listen(port, () => {
  console.log(`🔗 Link Shortener listening at http://localhost:${port}`);
});
