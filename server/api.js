const express = require("express");
const router = express.Router();
const db = require("better-sqlite3")("./data/links.db");

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
  const linkdb = (() => {
    if (req.user) {
      return db
        .prepare(`SELECT id FROM links WHERE link=? AND owner = ?`)
        .get(req.body.newUrl, req.user.id);
    } else {
      return db
        .prepare(`SELECT id FROM links WHERE link=? AND owner IS NULL`)
        .get(req.body.newUrl);
    }
  })();
  if (linkdb !== undefined) {
    res.send(linkdb.id);
  } else {
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
  if (!user) {
    data = db.prepare(`SELECT * FROM links;`).all();
  } else {
    data = db.prepare(`SELECT id, link, uses FROM links WHERE owner = ?;`).all(user);
  }
  return data || [];
}

router.delete("/remove/:id", functions.checkAuthenticated, async (req, res) => {
  if (req.user.role === "admin" || req.user.role === "initAdmin") {
    db.prepare(`DELETE FROM links WHERE id=?`).run(req.params.id);
    res.send(sendAllLinks());
  } else {
    let link = await db.prepare(`SELECT * FROM links WHERE id=?`).get(req.params.id);
    if(link.owner === req.user.id) {
      db.prepare(`DELETE FROM links WHERE id=?`).run(req.params.id);
      res.send(sendAllLinks(req.user.id));
    } else {
      res.sendStatus(401);
    }
  }

});

router.get("/all", functions.checkAdminAuthenticated, (req, res) => {
  res.send(sendAllLinks());
});

router.get("/my", functions.checkAuthenticated, (req, res) => {
  res.send(sendAllLinks(req.user.id));
});

module.exports = router;
