const db = require("better-sqlite3")("./server/data/data.db");

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
	"uses"	INTEGER DEFAULT 0,
	"owner"	INTEGER,
	PRIMARY KEY("id"),
  FOREIGN KEY (owner) REFERENCES users(id) ON DELETE SET NULL
);`);
