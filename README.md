# News Pulse — Topic-Clustered News Timeline

News Pulse is a full-stack application that collects live news from multiple RSS feeds, groups related articles into topic clusters, and displays them on a visual timeline.

## Live Demo

**Frontend:** https://frontend-eight-brown-83.vercel.app/

**Backend:** https://news-pulse-ff0m.onrender.com

## Tech Stack

* **Scraper:** Python, feedparser, trafilatura
* **Backend:** Node.js, Express.js, SQLite
* **Frontend:** Next.js, React, CSS
* **Deployment:** Vercel (Frontend), Render (Backend)

## Project Structure

```text
news-pulse/
├── scraper/     # RSS ingestion, article extraction & clustering
├── backend/     # Express REST API
├── frontend/    # Next.js frontend
├── Dockerfile
└── README.md
```

## How It Works

1. Python fetches articles from RSS feeds.
2. RSS data is normalized into a common format.
3. The scraper attempts to extract the full article content.
4. Duplicate articles are skipped during repeated runs.
5. Related articles are grouped using keyword overlap.
6. Articles and clusters are stored in SQLite.
7. Express APIs serve the data to the frontend.
8. Next.js displays the clusters on a timeline.

## News Sources

* BBC News
* NPR
* The Guardian

## Topic Grouping

I used a **keyword-overlap approach** instead of TF-IDF because it is simple, transparent, and suitable for the scope of this project.

Article headlines and summaries are normalized by converting text to lowercase, removing punctuation and common stop words, and extracting meaningful words. Articles with sufficient meaningful-word overlap are grouped into the same topic cluster.

The cluster label is generated from the representative keywords of the grouped articles.

**Limitation:** Articles covering the same story may use different vocabulary, so keyword overlap can sometimes fail to recognize them as related.

## API Endpoints

| Method | Endpoint                | Purpose                          |
| ------ | ----------------------- | -------------------------------- |
| GET    | `/clusters`             | List topic clusters              |
| GET    | `/clusters/:id`         | Get cluster details and articles |
| GET    | `/timeline`             | Timeline-ready cluster data      |
| GET    | `/sources`              | List available sources           |
| GET    | `/articles`             | List articles                    |
| POST   | `/ingest/trigger`       | Start ingestion                  |
| GET    | `/ingest/status/:jobId` | Check ingestion status           |

## Local Setup

### Backend

```bash
cd backend
npm install
node server.js
```

### Scraper

```bash
cd scraper
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and the backend on `http://localhost:4000` by default.

## Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** SQLite
* **Containerization:** Docker

Environment-specific configuration is provided through environment variables and is not committed to the repository.

## Future Improvements

* Semantic similarity for better story grouping
* Automatic scheduled ingestion
* Improved article extraction
* More advanced timeline interactions
