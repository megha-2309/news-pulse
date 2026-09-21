import re
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

import trafilatura


def clean_text(text):
    """
    Remove HTML and unnecessary whitespace.
    """

    if not text:
        return ""

    # Remove HTML tags.
    text = re.sub(
        r"<[^>]+>",
        " ",
        text
    )

    # Replace repeated whitespace with one space.
    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


def parse_date(entry):
    """
    Convert different RSS date formats into
    one ISO UTC timestamp.
    """

    date_value = (
        entry.get("published")
        or entry.get("updated")
        or entry.get("created")
    )

    # If no date exists, use current UTC time.
    if not date_value:
        return datetime.now(
            timezone.utc
        ).isoformat()

    try:
        parsed = parsedate_to_datetime(
            date_value
        )

        # Add UTC if the RSS feed didn't provide
        # timezone information.
        if parsed.tzinfo is None:
            parsed = parsed.replace(
                tzinfo=timezone.utc
            )

        # Convert to UTC.
        parsed = parsed.astimezone(
            timezone.utc
        )

        return parsed.isoformat()

    except Exception:
        # Do not crash the entire ingestion
        # because one feed has a bad date.
        return datetime.now(
            timezone.utc
        ).isoformat()


def extract_article_body(url):
    """
    Attempt to download and extract the
    main article body.
    """

    try:
        downloaded = trafilatura.fetch_url(
            url
        )

        if not downloaded:
            return ""

        body = trafilatura.extract(
            downloaded,
            include_comments=False,
            include_tables=False,
        )

        return body or ""

    except Exception as error:
        print(
            f"Article extraction failed "
            f"for {url}: {error}"
        )

        return ""
