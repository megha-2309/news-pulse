import os
from pathlib import Path


# Find the root directory of the project.
#
# __file__ points to:
# news-pulse/scraper/config.py
#
# parent points to:
# news-pulse/scraper
#
# parent.parent points to:
# news-pulse
BASE_DIR = Path(__file__).resolve().parent.parent


# Default directory for local application data.
DATA_DIR = BASE_DIR / "data"


# Create the directory if it doesn't already exist.
DATA_DIR.mkdir(exist_ok=True)


# Use DATABASE_PATH from the environment if provided.
#
# Otherwise use:
# news-pulse/data/news.db
DATABASE_PATH = os.getenv(
    "DATABASE_PATH",
    str(DATA_DIR / "news.db")
)


# Minimum number of shared meaningful words
# required to consider two articles related.
MIN_SHARED_WORDS = int(
    os.getenv(
        "MIN_SHARED_WORDS",
        "4"
    )
)


# Maximum number of RSS articles to process from each feed.
# Zero means process every article currently provided by the feed.
MAX_ARTICLES_PER_FEED = int(
    os.getenv(
        "MAX_ARTICLES_PER_FEED",
        "0"
    )
)
