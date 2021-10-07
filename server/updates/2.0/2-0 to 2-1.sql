-- If in server dir run (terminal):
-- sqlite3 links.db < updates/2.0/2-0\ to\ 2-1.sql 

PRAGMA foreign_keys = off;

BEGIN TRANSACTION;

ALTER TABLE links RENAME TO _links_old;

CREATE TABLE "links" (
	"id"	TEXT NOT NULL UNIQUE,
	"link"	TEXT NOT NULL,
	"uses"	INTEGER DEFAULT 0,
	"owner"	INTEGER,
	PRIMARY KEY("id"),
  FOREIGN KEY (owner) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO links SELECT * FROM _links_old;

DROP TABLE _links_old;

COMMIT;

PRAGMA foreign_keys = on;