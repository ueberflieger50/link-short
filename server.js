const express = require('express')
const app = express()
const port = 3000
const db = require('better-sqlite3')('links.db');
const bodyParser = require('body-parser');

db.exec(`CREATE TABLE IF NOT EXISTS "links" (
	"number"	INTEGER,
	"id"	TEXT,
	"link"	TEXT,
    "uses" INTEGER,
	PRIMARY KEY("number" AUTOINCREMENT)
);`)

function newId(id) {
    if (id == undefined || id == "") {
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
    if(data === undefined){
        res.redirect("/")
    }else {
        db.exec(`UPDATE links SET uses = uses + 1 where id='${req.params.id}'`)
        res.redirect(data.link)
    }
});

app.post('/api/new', (req, res) => {
    let id = newId(req.body.customId);
    let linkdb = db.prepare(`SELECT id FROM links WHERE link=?`).get(req.body.newUrl)
    if ( linkdb !== undefined) {
        res.redirect(`/?link=${linkdb.id}`);
    } else {
        db.exec(`INSERT INTO links (id, link, uses) VALUES ('${id}', '${req.body.newUrl}', '0')`)
        res.redirect(`/?link=${id}`);
    }
})

app.delete('/api/remove/:number', (req, res) => {
    db.exec(`DELETE FROM links WHERE number='${req.params.number}'`)
    let data = db.prepare(`SELECT * FROM links;`).all();
    res.send(data)
})

app.get('/api/all', (req, res) => {
    let data = db.prepare(`SELECT * FROM links;`).all();
    res.send(data)
})

app.listen(port, () => {
    console.log(`🔗 Link Shortener listening at http://localhost:${port}`)
})