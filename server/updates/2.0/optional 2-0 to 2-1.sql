-- If in server dir run (terminal):
-- sqlite3 links.db < updates/2.0/optional\ 2-0\ to\ 2-1.sql 

ALTER TABLE users
SET role = 'initAdmin'
WHERE id = 1; -- Change the id if your initial Admin has a different id (Should not be the case)