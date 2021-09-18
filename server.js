const express = require('express');
const app = express();
const port = 3000;
const db = require('better-sqlite3')('links.db');
const bodyParser = require('body-parser');

db.exec(`CREATE TABLE IF NOT EXISTS "links" (
	"id"	TEXT NOT NULL UNIQUE,
	"link"	TEXT NOT NULL,
	"uses"	INTEGER,
	PRIMARY KEY("id")
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

app.use('/', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/:id', (req, res) => {
    if(req.params.id === "robots.txt") res.send('');
    const redirect = db.prepare(`SELECT link FROM links WHERE id=?`).get(req.params.id);
    if(redirect === undefined){
        res.redirect("/");
    }else {
        db.prepare(`UPDATE links SET uses = uses + 1 where id=?`).run(req.params.id);
        res.redirect(redirect.link);
    }
});

app.post('/api/new', (req, res) => {
    const id = newId(req.body.customId);
    const linkdb = db.prepare(`SELECT id FROM links WHERE link=?`).get(req.body.newUrl);
    if ( linkdb !== undefined) {
        res.redirect(`/?link=${linkdb.id}`);
    } else {
        db.prepare(`INSERT INTO links (id, link, uses) VALUES (?, ?, ?)`).run(id, req.body.newUrl, 0);
        res.send(id);
    }
});

function sendAllLinks() {
    const data = db.prepare(`SELECT * FROM links;`).all();
    return data;
}

app.delete('/api/remove/:id', (req, res) => {
    db.prepare(`DELETE FROM links WHERE id=?`).run(req.params.id);
    res.send(sendAllLinks());
});

app.get('/api/all', (req, res) => {
    res.send(sendAllLinks());
});

app.listen(port, () => {
    console.log(`🔗 Link Shortener listening at http://localhost:${port}`);
});