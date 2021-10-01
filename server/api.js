const express = require("express");
const router = express.Router();
const db = require("better-sqlite3")("links.db");

const functions = require("./functions");

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

router.post("/new", (req, res) => {
  const id = newId(req.body.customId);
  const linkdb = db
    .prepare(`SELECT id FROM links WHERE link=?`)
    .get(req.body.newUrl);
  if (linkdb !== undefined) {
    res.send(id);
  } else {
    console.log(req.user?.id );
    db.prepare(`INSERT INTO links (id, link, owner) VALUES (?, ?, ?)`).run(
      id,
      req.body.newUrl,
      req.user?.id || null
    );
    res.send(id);
  }
});

function sendAllLinks(user) {
  let data;
  if(!user) {
    data = db.prepare(`SELECT * FROM links;`).all();
  } else {
    data = db.prepare(`SELECT * FROM links WHERE owner = ?;`).all(user);
  }
  return data || [];
}

router.delete("/remove/:id", functions.checkAuthenticated, (req, res) => {
  db.prepare(`DELETE FROM links WHERE id=?`).run(req.params.id);
  res.send(sendAllLinks());
});

router.get("/all", functions.checkAdminAuthenticated, (req, res) => {
  res.send(sendAllLinks());
});

router.get("/my", functions.checkAuthenticated, (req, res) => {
  res.send(sendAllLinks(req.user.id));
});

module.exports = router;