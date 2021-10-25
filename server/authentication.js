const express = require("express");
const router = express.Router();
const passport = require("passport");
const db = require("better-sqlite3")("links.db");
const bcrypt = require("bcrypt");

const functions = require("./functions");

router.get("/isloggedin", (req, res) => {
  if (req.isAuthenticated()) {
    res.send([true, req.user.username]);
  } else {
    res.send(false);
  }
});

router.post("/register", functions.checkNotAuthenticated, async (req, res, next) => {
  const usernames = db.prepare(`SELECT username FROM users WHERE username = ?`).get(req.body.username);
  if (usernames === undefined) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      if (db.prepare(`SELECT * FROM users LIMIT 1`).all().length > 0) {
        await db.prepare(
          `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`
        ).run(req.body.username, hashedPassword, "user");
      } else {
        await db.prepare(
          `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`
        ).run(req.body.username, hashedPassword, "initAdmin");
      }
      next();
    } catch (err) {
      console.warn(err);
      res.sendStatus(500);
    }
  } else {
    res.send("User already exists");
  }
}, passport.authenticate("local"), (req, res) => {
  res.sendStatus(202);
});

router.post(
  "/login",
  functions.checkNotAuthenticated,
  passport.authenticate("local"),
  (req, res) => {
    res.sendStatus(202);
  }
);

router.delete("/logout", functions.checkAuthenticated, (req, res) => {
  req.logOut();
  res.sendStatus(200);
});

module.exports = router;
