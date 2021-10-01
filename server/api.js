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

router.delete("/remove/:id", functions.checkAuthenticated, (req, res) => {
  db.prepare(`DELETE FROM links WHERE id=?`).run(req.params.id);
  res.send(sendAllLinks());
});

router.get("/all", functions.checkAdminAuthenticated, (req, res) => {
  res.send(sendAllLinks());
});

module.exports = router;