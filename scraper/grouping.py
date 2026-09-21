import re
import uuid

from collections import Counter

from database import get_connection

from config import MIN_SHARED_WORDS


STOP_WORDS = {
    "the",
    "and",
    "for",
    "that",
    "with",
    "this",
    "from",
    "are",
    "was",
    "were",
    "has",
    "have",
    "had",
    "will",
    "would",
    "could",
    "should",
    "about",
    "after",
    "before",
    "into",
    "over",
    "under",
    "their",
    "there",
    "they",
    "them",
    "than",
    "then",
    "also",
    "said",
    "says",
    "been",
    "being",
    "its",
    "it's",
    "but",
    "not",
    "you",
    "your",
    "our",
    "out",
    "who",
    "what",
    "when",
    "where",
    "why",
    "how",
    "all",
    "any",
    "can",
    "may",
    "more",
    "new",
}


def tokenize(text):
    """
    Convert text into a set of meaningful words.
    """

    if not text:
        return set()

    text = text.lower()

    words = re.findall(
        r"\b[a-z]{3,}\b",
        text
    )

    meaningful_words = [
        word
        for word in words
        if word not in STOP_WORDS
    ]

    return set(
        meaningful_words
    )


def article_words(article):
    """
    Get meaningful words from an article's
    headline and summary.
    """

    combined_text = (
        article["title"]
        + " "
        + (article["summary"] or "")
    )

    return tokenize(
        combined_text
    )


def shared_words(article_a, article_b):
    """
    Return words shared by two articles.
    """

    words_a = article_words(
        article_a
    )

    words_b = article_words(
        article_b
    )

    return words_a.intersection(
        words_b
    )


def build_clusters(articles):
    """
    Group articles using keyword overlap.
    """

    clusters = []

    for article in articles:

        current_words = article_words(
            article
        )

        matching_clusters = []

        for cluster in clusters:

            cluster_words = set()

            for existing_article in cluster:

                cluster_words.update(
                    article_words(
                        existing_article
                    )
                )

            overlap = current_words.intersection(
                cluster_words
            )

            if len(overlap) >= MIN_SHARED_WORDS:

                matching_clusters.append(
                    cluster
                )

        if not matching_clusters:

            clusters.append(
                [article]
            )

        else:

            merged_cluster = [
                article
            ]

            for cluster in matching_clusters:

                merged_cluster.extend(
                    cluster
                )

                if cluster in clusters:
                    clusters.remove(
                        cluster
                    )

            clusters.append(
                merged_cluster
            )

    return clusters


def generate_label(cluster):
    """
    Generate a human-readable cluster label
    using the most frequent meaningful words.
    """

    counter = Counter()

    for article in cluster:

        words = article_words(
            article
        )

        counter.update(
            words
        )

    common_words = [
        word
        for word, count
        in counter.most_common(3)
    ]

    if not common_words:
        return "General News"

    return " / ".join(
        word.title()
        for word in common_words
    )


def rebuild_clusters():
    """
    Read all articles and rebuild clusters.
    """

    connection = get_connection()

    rows = connection.execute(
        """
        SELECT
            id,
            title,
            summary,
            source,
            url,
            published_at
        FROM articles
        ORDER BY published_at ASC
        """
    ).fetchall()

    articles = [
        dict(row)
        for row in rows
    ]

    clusters = build_clusters(
        articles
    )

    # Remove old cluster relationships.
    connection.execute(
        """
        UPDATE articles
        SET cluster_id = NULL
        """
    )

    # Remove old clusters.
    connection.execute(
        """
        DELETE FROM clusters
        """
    )

    for cluster in clusters:

        cluster_id = str(
            uuid.uuid4()
        )

        label = generate_label(
            cluster
        )

        connection.execute(
            """
            INSERT INTO clusters (
                id,
                label,
                created_at
            )
            VALUES (?, ?, datetime('now'))
            """,
            (
                cluster_id,
                label,
            ),
        )

        for article in cluster:

            connection.execute(
                """
                UPDATE articles
                SET cluster_id = ?
                WHERE id = ?
                """,
                (
                    cluster_id,
                    article["id"],
                ),
            )

    connection.commit()

    connection.close()

    print(
        f"Created {len(clusters)} clusters."
    )
