const express = require('express')
const app = express()
const port = 3000
const db = require('better-sqlite3')('links.db');
const bodyParser = require('body-parser');

db.exec(`CREATE TABLE IF NOT EXISTS "links" (
	"number"	INTEGER,
	"id"	TEXT,
	"link"	TEXT,
	PRIMARY KEY("number" AUTOINCREMENT)
);`)

function newId(id) {
    if (id == undefined) {
        id = Math.random().toString(36).slice(2, 8)
    }
    if (db.prepare(`SELECT id FROM links WHERE id=?`).get(id) !== undefined) {
        return newId();
    } else {
        return id;
    }
}

app.use('/', express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/:id', (req, res) => {
    let data = db.prepare(`SELECT link FROM links WHERE id=?`).get(req.params.id);
    res.redirect(data.link)
});

app.post('/api/new', (req, res) => {
    let id = newId();
    db.exec(`INSERT INTO links (id, link) VALUES ('${id}', '${req.body.newUrl}')`)
    res.redirect(`/?link=${id}`);
})

app.get('/api/all', (req, res) => {
    let data = db.prepare(`SELECT * FROM links;`).all();
    res.send(data)
})

app.listen(port, () => {
    console.log(`🔗 Link Shortener listening at http://localhost:${port}`)
})