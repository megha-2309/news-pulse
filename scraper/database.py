import sqlite3

from config import DATABASE_PATH


def get_connection():
    """
    Create and return a SQLite database connection.
    """

    connection = sqlite3.connect(
        DATABASE_PATH
    )

    # Return rows that behave like dictionaries.
    #
    # Example:
    # row["title"]
    #
    # instead of:
    # row[1]
    connection.row_factory = sqlite3.Row

    # WAL improves SQLite behavior when
    # multiple operations happen around the same time.
    connection.execute(
        "PRAGMA journal_mode=WAL"
    )

    return connection


def initialize_database():
    """
    Create the database tables and indexes
    if they don't already exist.
    """

    connection = get_connection()

    connection.executescript(
        """
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            title TEXT NOT NULL,

            summary TEXT,

            body TEXT,

            source TEXT NOT NULL,

            url TEXT NOT NULL UNIQUE,

            published_at TEXT NOT NULL,

            cluster_id TEXT
        );


        CREATE TABLE IF NOT EXISTS clusters (
            id TEXT PRIMARY KEY,

            label TEXT NOT NULL,

            created_at TEXT NOT NULL
        );


        CREATE INDEX IF NOT EXISTS
        idx_articles_cluster_id
        ON articles(cluster_id);


        CREATE INDEX IF NOT EXISTS
        idx_articles_published_at
        ON articles(published_at);
        """
    )

    connection.commit()

    connection.close()
