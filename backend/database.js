const Database = require("better-sqlite3");

const path = require("path");


const databasePath =
  process.env.DATABASE_PATH ||
  path.join(
    __dirname,
    "..",
    "data",
    "news.db"
  );


const db =
  new Database(databasePath);


db.pragma(
  "journal_mode = WAL"
);


module.exports = db;