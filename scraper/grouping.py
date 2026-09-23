
import uuid

from database import get_connection


# ============================================================
# 17 FIXED TOPIC GROUPS
# ============================================================

TOPIC_GROUPS = [
    "World News & Diplomacy",
    "Human Interest & Lifestyle",
    "US Politics & Trump",
    "UK & Europe",
    "Crime, Courts & Policing",
    "Wars, Conflicts & Middle East",
    "Business, Economy & Trade",
    "Technology & AI",
    "Law, Rights & Society",
    "Health & Medicine",
    "Culture, Entertainment & Fashion",
    "Science & Research",
    "Australia & New Zealand",
    "Asia & Pacific",
    "Climate & Environment",
    "Sports",
    "Transport & Aviation",
]


# ============================================================
# CATEGORY KEYWORDS
# ============================================================

CATEGORY_KEYWORDS = {

    "US Politics & Trump": [
        "donald trump",
        "president trump",
        "trump",
        "white house",
        "us president",
        "u.s. president",
        "congress",
        "senate",
        "senator",
        "republican",
        "republicans",
        "democrat",
        "democrats",
        "gop",
        "washington",
        "us election",
        "u.s. election",
        "midterm",
        "midterms",
        "immigration",
        "immigrant",
        "immigrants",
        "deportation",
        "deport",
        "ice agent",
        "national guard",
        "department of justice",
        "doj",
        "supreme court",
        "american politics",
        "us politics",
        "u.s. politics",
    ],

    "Sports": [
        "football",
        "soccer",
        "cricket",
        "tennis",
        "rugby",
        "golf",
        "basketball",
        "baseball",
        "boxing",
        "formula 1",
        "f1",
        "racing",
        "athlete",
        "athletes",
        "championship",
        "champions league",
        "premier league",
        "world cup",
        "olympics",
        "olympic",
        "medal",
        "match",
        "matches",
        "coach",
        "player",
        "players",
        "team",
        "teams",
        "tournament",
        "tournaments",
        "arsenal",
        "liverpool",
        "chelsea",
        "manchester united",
        "manchester city",
        "mikel arteta",
    ],

    "Technology & AI": [
        "artificial intelligence",
        "generative ai",
        "machine learning",
        "openai",
        "chatgpt",
        "ai model",
        "ai models",
        "ai system",
        "ai systems",
        "technology",
        "technology company",
        "tech company",
        "software",
        "software company",
        "cybersecurity",
        "cyber security",
        "cyber attack",
        "computer",
        "computing",
        "robot",
        "robots",
        "robotics",
        "digital technology",
        "internet",
        "social media",
        "semiconductor",
        "semiconductors",
        "chip",
        "chips",
        "data center",
        "data centres",
    ],

    "Wars, Conflicts & Middle East": [
        "gaza",
        "israel",
        "israeli",
        "palestine",
        "palestinian",
        "hamas",
        "hezbollah",
        "iran",
        "iranian",
        "yemen",
        "houthi",
        "houthis",
        "saudi arabia",
        "syria",
        "syrian",
        "lebanon",
        "iraq",
        "ukraine",
        "russia",
        "russian",
        "war",
        "warfare",
        "military",
        "missile",
        "missiles",
        "bombing",
        "bombings",
        "airstrike",
        "airstrikes",
        "ceasefire",
        "conflict",
        "conflicts",
        "fighters",
        "troops",
        "army",
        "soldiers",
        "invasion",
        "battle",
        "battles",
    ],

    "Crime, Courts & Policing": [
        "police",
        "policing",
        "arrest",
        "arrested",
        "murder",
        "murdered",
        "killed",
        "killing",
        "shooting",
        "shot",
        "gun",
        "guns",
        "suspect",
        "suspects",
        "crime",
        "criminal",
        "criminals",
        "court",
        "courts",
        "judge",
        "judges",
        "trial",
        "trials",
        "sentence",
        "sentenced",
        "prison",
        "jail",
        "investigation",
        "investigate",
        "investigator",
        "investigators",
        "prosecutor",
        "prosecution",
        "murder trial",
        "kidnapped",
        "kidnap",
        "convicted",
        "conviction",
        "charged",
        "charges",
    ],

    "Health & Medicine": [
        "health",
        "healthcare",
        "health care",
        "medical",
        "medicine",
        "doctor",
        "doctors",
        "hospital",
        "hospitals",
        "patient",
        "patients",
        "disease",
        "diseases",
        "cancer",
        "drug",
        "drugs",
        "treatment",
        "treatments",
        "virus",
        "viral",
        "outbreak",
        "infection",
        "infected",
        "meningitis",
        "overdose",
        "paracetamol",
        "ketamine",
        "pregnancy",
        "pregnant",
        "abortion",
        "mental health",
        "blood test",
        "fda",
        "pharmaceutical",
        "pharmaceuticals",
        "medicine",
        "surgery",
        "surgical",
        "diagnosis",
    ],

    "Climate & Environment": [
        "climate change",
        "climate",
        "global warming",
        "warming",
        "carbon emissions",
        "carbon",
        "emissions",
        "wildfire",
        "wildfires",
        "forest fire",
        "forest fires",
        "flood",
        "flooding",
        "drought",
        "heatwave",
        "heat wave",
        "storm",
        "storms",
        "hurricane",
        "typhoon",
        "cyclone",
        "weather",
        "rainfall",
        "temperature",
        "nature",
        "wildlife",
        "biodiversity",
        "conservation",
        "ecosystem",
        "environment",
        "environmental",
        "pollution",
        "sea level",
        "ocean",
    ],

    "Transport & Aviation": [
        "aviation",
        "airline",
        "airlines",
        "airport",
        "airports",
        "flight",
        "flights",
        "aircraft",
        "plane",
        "planes",
        "airspace",
        "air traffic",
        "traffic control",
        "pilot",
        "pilots",
        "train",
        "trains",
        "rail",
        "railway",
        "railways",
        "transport",
        "bus",
        "buses",
        "road",
        "roads",
        "motorway",
        "subway",
        "metro",
        "ferry",
    ],

    "Business, Economy & Trade": [
        "business",
        "businesses",
        "economy",
        "economic",
        "economics",
        "market",
        "markets",
        "company",
        "companies",
        "corporate",
        "bank",
        "banks",
        "finance",
        "financial",
        "investment",
        "investor",
        "investors",
        "trade",
        "tariff",
        "tariffs",
        "price",
        "prices",
        "cost",
        "costs",
        "inflation",
        "interest rate",
        "interest rates",
        "stocks",
        "stock market",
        "shares",
        "revenue",
        "profit",
        "profits",
        "billion",
        "million",
        "jobs",
        "employment",
        "workers",
        "industry",
        "industries",
        "deal",
        "merger",
        "acquisition",
        "earnings",
        "sales",
        "retail",
    ],

    "UK & Europe": [
        "united kingdom",
        "uk",
        "u.k.",
        "britain",
        "british",
        "england",
        "scotland",
        "wales",
        "northern ireland",
        "london",
        "germany",
        "german",
        "france",
        "french",
        "spain",
        "spanish",
        "italy",
        "italian",
        "europe",
        "european",
        "european union",
        "eu",
        "berlin",
        "paris",
        "rome",
        "merz",
        "macron",
        "starmer",
        "german chancellor",
        "french president",
    ],

    "Australia & New Zealand": [
        "australia",
        "australian",
        "sydney",
        "melbourne",
        "brisbane",
        "canberra",
        "queensland",
        "victoria",
        "tasmania",
        "perth",
        "adelaide",
        "new zealand",
        "new zealanders",
        "wellington",
        "albanese",
    ],

    "Asia & Pacific": [
        "japan",
        "japanese",
        "china",
        "chinese",
        "india",
        "indian",
        "pakistan",
        "pakistani",
        "nepal",
        "nepalese",
        "korea",
        "south korea",
        "north korea",
        "taiwan",
        "sri lanka",
        "thailand",
        "indonesia",
        "philippines",
        "vietnam",
        "malaysia",
        "singapore",
        "bangladesh",
        "asia",
        "asian",
        "pacific",
    ],

    "Science & Research": [
        "scientist",
        "scientists",
        "science",
        "research",
        "researcher",
        "researchers",
        "study",
        "studies",
        "discovery",
        "discover",
        "discovered",
        "experiment",
        "experiments",
        "space",
        "nasa",
        "astronomy",
        "physics",
        "biology",
        "chemistry",
        "genetics",
        "genetic",
        "species",
        "fossil",
        "archaeology",
        "archaeological",
        "ancient",
        "laboratory",
        "laboratories",
        "scientific",
        "research paper",
    ],

    "Culture, Entertainment & Fashion": [
        "film",
        "films",
        "movie",
        "movies",
        "actor",
        "actress",
        "actors",
        "music",
        "musician",
        "singer",
        "album",
        "concert",
        "celebrity",
        "celebrities",
        "fashion",
        "fashion week",
        "designer",
        "designers",
        "book",
        "books",
        "author",
        "authors",
        "artist",
        "artists",
        "art",
        "museum",
        "television",
        "tv",
        "entertainment",
        "theatre",
        "theater",
        "culture",
        "cultural",
        "gaming",
        "video game",
        "video games",
        "exhibition",
    ],

    "Law, Rights & Society": [
        "law",
        "laws",
        "legal",
        "legislation",
        "rights",
        "human rights",
        "civil rights",
        "protest",
        "protests",
        "protester",
        "protesters",
        "demonstration",
        "demonstrators",
        "society",
        "social",
        "community",
        "communities",
        "discrimination",
        "equality",
        "freedom",
        "privacy",
        "ban",
        "banned",
        "policy",
        "policies",
        "lawmakers",
        "legislator",
        "legislators",
    ],

    "Human Interest & Lifestyle": [
        "family",
        "families",
        "child",
        "children",
        "woman",
        "women",
        "man",
        "men",
        "lifestyle",
        "home",
        "housing",
        "house",
        "food",
        "recipe",
        "recipes",
        "cooking",
        "cook",
        "school",
        "schools",
        "student",
        "students",
        "education",
        "travel",
        "travelling",
        "traveling",
        "relationship",
        "relationships",
        "wedding",
        "personal",
        "everyday life",
        "life",
    ],

    "World News & Diplomacy": [
        "united nations",
        "un nations",
        "u.n.",
        "nato",
        "diplomacy",
        "diplomatic",
        "ambassador",
        "summit",
        "world leaders",
        "foreign ministers",
        "international",
        "global",
        "world",
        "rwanda",
        "africa",
        "african",
        "nigeria",
        "colombia",
        "malawi",
        "foreign policy",
        "international relations",
    ],
}


# ============================================================
# PRIORITY
# More specific topics are checked before broad categories.
# ============================================================

CATEGORY_PRIORITY = [
    "US Politics & Trump",
    "Sports",
    "Technology & AI",
    "Wars, Conflicts & Middle East",
    "Health & Medicine",
    "Crime, Courts & Policing",
    "Climate & Environment",
    "Transport & Aviation",
    "Business, Economy & Trade",
    "Australia & New Zealand",
    "Asia & Pacific",
    "UK & Europe",
    "Science & Research",
    "Culture, Entertainment & Fashion",
    "Law, Rights & Society",
    "Human Interest & Lifestyle",
    "World News & Diplomacy",
]


# ============================================================
# CLASSIFICATION
# ============================================================

def classify_article(article):
    """
    Assign every article to exactly one fixed topic.

    Title gets the strongest weight.
    Summary gets medium weight.
    Body gets a smaller weight.

    This prevents common words in article bodies from
    dominating the topic.
    """

    title = (
        article.get("title", "") or ""
    ).lower()

    summary = (
        article.get("summary", "") or ""
    ).lower()

    body = (
        article.get("body", "") or ""
    ).lower()

    scores = {
        category: 0
        for category in TOPIC_GROUPS
    }

    # --------------------------------------------------------
    # Score each category
    # --------------------------------------------------------

    for category in CATEGORY_PRIORITY:

        for keyword in CATEGORY_KEYWORDS[category]:

            if keyword in title:
                scores[category] += 12

            elif keyword in summary:
                scores[category] += 5

            elif keyword in body:
                scores[category] += 1

    # --------------------------------------------------------
    # Strong title signals
    # --------------------------------------------------------

    title_text = f" {title} "

    if " trump " in title_text:
        scores["US Politics & Trump"] += 35

    if any(
        word in title
        for word in [
            "football",
            "soccer",
            "cricket",
            "tennis",
            "rugby",
            "golf",
            "basketball",
            "champions league",
            "premier league",
            "olympic",
            "tournament",
            "arsenal",
            "liverpool",
            "chelsea",
            "mikel arteta",
        ]
    ):
        scores["Sports"] += 35

    if any(
        word in title
        for word in [
            "artificial intelligence",
            "openai",
            "chatgpt",
            " ai ",
            "ai model",
            "ai models",
        ]
    ):
        scores["Technology & AI"] += 30

    # --------------------------------------------------------
    # Geographic signals
    # --------------------------------------------------------

    if any(
        word in title
        for word in [
            "australia",
            "australian",
            "sydney",
            "melbourne",
            "brisbane",
            "canberra",
            "new zealand",
        ]
    ):
        scores["Australia & New Zealand"] += 25

    if any(
        word in title
        for word in [
            "japan",
            "japanese",
            "china",
            "chinese",
            "india",
            "indian",
            "pakistan",
            "sri lanka",
            "korea",
            "taiwan",
            "nepal",
        ]
    ):
        scores["Asia & Pacific"] += 20

    # --------------------------------------------------------
    # Conflict signals
    # --------------------------------------------------------

    if any(
        word in title
        for word in [
            "gaza",
            "israel",
            "iran",
            "yemen",
            "houthi",
            "ukraine",
            "russia",
            "missile",
            "airstrike",
            "ceasefire",
            "war",
            "military",
        ]
    ):
        scores["Wars, Conflicts & Middle East"] += 30

    # --------------------------------------------------------
    # Health signals
    # --------------------------------------------------------

    if any(
        word in title
        for word in [
            "health",
            "healthcare",
            "medical",
            "hospital",
            "doctor",
            "disease",
            "cancer",
            "meningitis",
            "overdose",
            "drug",
            "treatment",
            "virus",
            "outbreak",
        ]
    ):
        scores["Health & Medicine"] += 25

    # --------------------------------------------------------
    # Crime signals
    # --------------------------------------------------------

    if any(
        word in title
        for word in [
            "police",
            "arrested",
            "murder",
            "killed",
            "shooting",
            "court",
            "judge",
            "trial",
            "convicted",
            "prison",
            "crime",
        ]
    ):
        scores["Crime, Courts & Policing"] += 25

    # --------------------------------------------------------
    # Climate signals
    # --------------------------------------------------------

    if any(
        word in title
        for word in [
            "climate",
            "wildfire",
            "flood",
            "flooding",
            "drought",
            "heatwave",
            "storm",
            "hurricane",
            "typhoon",
            "cyclone",
            "emissions",
        ]
    ):
        scores["Climate & Environment"] += 25

    # --------------------------------------------------------
    # Transport signals
    # --------------------------------------------------------

    if any(
        word in title
        for word in [
            "airport",
            "airline",
            "flight",
            "aircraft",
            "aviation",
            "airspace",
            "train",
            "railway",
            "transport",
        ]
    ):
        scores["Transport & Aviation"] += 25

    # --------------------------------------------------------
    # Choose highest scoring category
    # --------------------------------------------------------

    best_category = "World News & Diplomacy"
    best_score = -1

    for category in CATEGORY_PRIORITY:

        if scores[category] > best_score:
            best_category = category
            best_score = scores[category]

    return best_category


# ============================================================
# REBUILD ALL CLUSTERS
# ============================================================

def rebuild_clusters():

    connection = get_connection()

    rows = connection.execute(
        """
        SELECT
            id,
            title,
            summary,
            body,
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

    print(
        f"Classifying {len(articles)} articles..."
    )

    # Remove previous assignments
    connection.execute(
        """
        UPDATE articles
        SET cluster_id = NULL
        """
    )

    # Remove previous clusters
    connection.execute(
        """
        DELETE FROM clusters
        """
    )

    # --------------------------------------------------------
    # Create exactly 17 clusters
    # --------------------------------------------------------

    cluster_ids = {}

    for category in TOPIC_GROUPS:

        cluster_id = str(
            uuid.uuid4()
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
                category,
            ),
        )

        cluster_ids[category] = cluster_id

    # --------------------------------------------------------
    # Assign every article
    # --------------------------------------------------------

    counts = {
        category: 0
        for category in TOPIC_GROUPS
    }

    for article in articles:

        category = classify_article(
            article
        )

        connection.execute(
            """
            UPDATE articles
            SET cluster_id = ?
            WHERE id = ?
            """,
            (
                cluster_ids[category],
                article["id"],
            ),
        )

        counts[category] += 1

    connection.commit()
    connection.close()

    # --------------------------------------------------------
    # Print final result
    # --------------------------------------------------------

    print("")
    print("========================================")
    print("17 TOPIC GROUPS")
    print("========================================")

    for category in TOPIC_GROUPS:

        print(
            f"{category}: "
            f"{counts[category]} articles"
        )

    print("========================================")

    print(
        f"Created {len(TOPIC_GROUPS)} topic groups."
    )

