const express = require("express");
const router = express.Router();
const db = require("better-sqlite3")("./data/links.db");
const functions = require("./functions");

function getUsers() {
  return db.prepare("SELECT id, username, role FROM users").all();
}

router.get("/all", functions.checkAdminAuthenticated, (req, res) => {
	res.send(getUsers());
});

router.patch("/alter/:id", functions.checkAdminAuthenticated, (req, res) => {
  const role = db
    .prepare("SELECT role FROM users WHERE id = ?")
    .get(req.params.id);
  if (role.role === "initAdmin") {
    res.send({ error: "This admin cannot be converted to a user" });
  } else if (role.role === "user") {
    db.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(
      req.params.id
    );
		res.send(getUsers());
  } else if (role.role === "admin") {
    db.prepare("UPDATE users SET role = 'user' WHERE id = ?").run(
      req.params.id
    );
		res.send(getUsers());
  } else {
    res.send({ error: "sorry couldn't find a user with that id" });
  }
});

router.delete("/remove/:id", functions.checkAuthenticated, (req, res) => {
	// If someone sees this and knows a better was to do it pleas go ahead and open an issue or pr.
  let checkMe = false;
  if(req.params.id === "me") {
    req.params.id = req.user.id;
    checkMe = true;
  }
	if(req.body.logout === true) {
		let userId = req.user.id;
		req.logOut();
		req.user = { id: String(userId)};
	}
  const role = db
  .prepare("SELECT role FROM users WHERE id = ?")
  .get(req.params.id);
  if (role.role === "initAdmin") {
    res.send({ error: "This admin cannot be deleted" });
  } else if (req.user?.role === "admin" || req.user?.role === "initAdmin") {
    db.prepare(`DELETE FROM users WHERE id=?`).run(req.params.id);
    res.send(db.prepare("SELECT id, username, role FROM users").all());
  } else if (req.user?.id === req.params.id || checkMe) {
    db.prepare(`DELETE FROM users WHERE id=?`).run(req.params.id);
		res.sendStatus(200);
  } else {
    res.send({ error: "You are not allowed to perform this action" });
  }
});

module.exports = router;
