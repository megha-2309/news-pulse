# News Pulse

News Pulse is a full-stack news monitoring application that collects articles from RSS feeds, groups related stories, and presents them in a web dashboard.

## Overview

- Scrapes and stores news articles from configured sources
- Groups similar stories together using clustering logic
- Exposes data through a backend API
- Displays the results in a frontend interface for browsing and filtering

## Project Structure

- `backend/` – API server and data access logic
- `frontend/` – Next.js web application
- `scraper/` – feed scraping, grouping, and database initialization logic
- `data/` – local data storage or generated datasets
- `Dockerfile` – container setup for the app

## Tech Stack

- Python for the scraper pipeline
- Node.js for the backend API
- Next.js for the frontend interface
- SQLite or similar local database storage for article and grouping data

## Getting Started

### 1. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

Scraper:

```bash
cd scraper
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Run the scraper

```bash
cd scraper
python main.py
```

### 3. Run the backend

```bash
cd backend
node server.js
```

### 4. Run the frontend

```bash
cd frontend
npm run dev
```

## Notes

This project is designed to aggregate and cluster news coverage so users can see related stories together and explore them through a simple interface.
