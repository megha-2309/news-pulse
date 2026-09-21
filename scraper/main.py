import feedparser

from config import MAX_ARTICLES_PER_FEED

from database import (
    get_connection,
    initialize_database,
)

from extractor import (
    clean_text,
    parse_date,
    extract_article_body,
)

from feeds import FEEDS

from grouping import rebuild_clusters


def normalize_entry(
    entry,
    source
):
    """
    Convert an RSS entry into our
    common article structure.
    """

    title = clean_text(
        entry.get(
            "title",
            ""
        )
    )

    summary = clean_text(
        entry.get(
            "summary"
        )
        or entry.get(
            "description"
        )
        or ""
    )

    # Some RSS feeds expose content
    # through the content field.
    if not summary:

        contents = entry.get(
            "content",
            []
        )

        if contents:

            summary = clean_text(
                contents[0].get(
                    "value",
                    ""
                )
            )

    url = entry.get(
        "link",
        ""
    ).strip()

    published_at = parse_date(
        entry
    )

    return {
        "title": title,
        "summary": summary,
        "source": source,
        "url": url,
        "published_at": published_at,
    }


def article_exists(url):
    """
    Check whether an article URL
    already exists.
    """

    connection = get_connection()

    row = connection.execute(
        """
        SELECT id
        FROM articles
        WHERE url = ?
        """,
        (url,),
    ).fetchone()

    connection.close()

    return row is not None


def save_article(article):
    """
    Save an article if it doesn't already exist.
    """

    if article_exists(
        article["url"]
    ):
        return False

    body = extract_article_body(
        article["url"]
    )

    connection = get_connection()

    try:

        connection.execute(
            """
            INSERT INTO articles (
                title,
                summary,
                body,
                source,
                url,
                published_at
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                article["title"],
                article["summary"],
                body,
                article["source"],
                article["url"],
                article["published_at"],
            ),
        )

        connection.commit()

        return True

    except Exception as error:

        print(
            f"Could not save article: {error}"
        )

        return False

    finally:

        connection.close()


def process_feed(feed_config):
    """
    Download and process one RSS feed.
    """

    print(
        f"Fetching {feed_config['name']}..."
    )

    feed = feedparser.parse(
        feed_config["url"]
    )

    saved_count = 0

    entries = feed.entries[
        :MAX_ARTICLES_PER_FEED
    ]

    for entry in entries:

        article = normalize_entry(
            entry,
            feed_config["name"]
        )

        if not article["title"]:
            continue

        if not article["url"]:
            continue

        saved = save_article(
            article
        )

        if saved:
            saved_count += 1

    print(
        f"{feed_config['name']}: "
        f"{saved_count} new articles"
    )


def main():
    """
    Main ingestion pipeline.
    """

    print(
        "Initializing database..."
    )

    initialize_database()

    print(
        "Starting RSS ingestion..."
    )

    for feed in FEEDS:

        try:

            process_feed(
                feed
            )

        except Exception as error:

            print(
                f"Feed failed: "
                f"{feed['name']} - "
                f"{error}"
            )

    print(
        "Rebuilding topic clusters..."
    )

    rebuild_clusters()

    print(
        "Pipeline completed."
    )


if __name__ == "__main__":
    main()
