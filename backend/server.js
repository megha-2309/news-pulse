const express = require("express");

const cors = require("cors");

const db = require("./database");

const { startIngestionJob, getJobStatus } = require("./jobs");

const app = express();

const PORT = process.env.PORT || 4000;

const NEWS_START = "2026-09-18T00:00:00Z";

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  }),
);

app.use(express.json());

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "news-pulse-api",
  });
});

/*
|--------------------------------------------------------------------------
| GET /clusters
|--------------------------------------------------------------------------
*/

app.get("/clusters", (req, res) => {
  try {
    const clusters = db
      .prepare(
        `
          SELECT
            c.id,
            c.label,
            COUNT(a.id)
              AS articleCount,
            MIN(a.published_at)
              AS startTime,
            MAX(a.published_at)
              AS endTime
          FROM clusters c
          LEFT JOIN articles a
            ON a.cluster_id = c.id
            AND a.published_at >= ?
          GROUP BY c.id
          HAVING COUNT(a.id) > 0
          ORDER BY startTime DESC
          `,
      )
      .all(NEWS_START);

    res.json(clusters);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch clusters",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /articles
|--------------------------------------------------------------------------
*/

app.get("/articles", (req, res) => {
  try {
    const articles = db
      .prepare(
        `
          SELECT
            id,
            title,
            summary,
            body,
            source,
            url,
            published_at AS publishedAt
          FROM articles
          WHERE published_at >= ?
            AND published_at < ?
          ORDER BY published_at DESC
        `,
      )
      .all(NEWS_START, NEWS_END);

    res.json(articles);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch articles",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /clusters/:id
|--------------------------------------------------------------------------
*/

app.get("/clusters/:id", (req, res) => {
  try {
    const cluster = db
      .prepare(
        `
          SELECT
            id,
            label
          FROM clusters
          WHERE id = ?
            AND EXISTS (
              SELECT 1
              FROM articles
              WHERE articles.cluster_id = clusters.id
                AND articles.published_at >= ?
            )
          `,
      )
      .get(req.params.id, NEWS_START);

    if (!cluster) {
      return res.status(404).json({
        error: "Cluster not found",
      });
    }

    const articles = db
      .prepare(
        `
          SELECT
            id,
            title,
            summary,
            body,
            source,
            url,
            published_at
              AS publishedAt
          FROM articles
          WHERE cluster_id = ?
            AND published_at >= ?
          ORDER BY
            published_at ASC
          `,
      )
      .all(req.params.id, NEWS_START);

    res.json({
      ...cluster,
      articles,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch cluster",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /sources
|--------------------------------------------------------------------------
*/

app.get("/sources", (req, res) => {
  try {
    const sources = db
      .prepare(
        `
          SELECT DISTINCT
            source
          FROM articles
          WHERE published_at >= ?
          ORDER BY source ASC
          `,
      )
      .all(NEWS_START);

    res.json(sources.map((item) => item.source));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch sources",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /timeline
|--------------------------------------------------------------------------
*/

app.get("/timeline", (req, res) => {
  try {
    const timeline = db
      .prepare(
        `
          SELECT
            c.id,
            c.label,
            MIN(a.published_at)
              AS startTime,
            MAX(a.published_at)
              AS endTime,
            COUNT(a.id)
              AS articleCount
          FROM clusters c
          JOIN articles a
            ON a.cluster_id = c.id
            AND a.published_at >= ?
          GROUP BY c.id
          ORDER BY startTime ASC
          `,
      )
      .all(NEWS_START);

    const formatted = timeline.map((cluster) => {
      const intensity = Math.min(100, cluster.articleCount * 15);

      return {
        id: cluster.id,

        label: cluster.label,

        startTime: cluster.startTime,

        endTime: cluster.endTime,

        articleCount: cluster.articleCount,

        intensity,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch timeline",
    });
  }
});

/*
|--------------------------------------------------------------------------
| POST /ingest/trigger
|--------------------------------------------------------------------------
*/

app.post("/ingest/trigger", (req, res) => {
  try {
    const jobId = startIngestionJob();

    res.status(202).json({
      jobId,
      status: "running",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to start ingestion",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /ingest/status/:jobId
|--------------------------------------------------------------------------
*/

app.get("/ingest/status/:jobId", (req, res) => {
  const job = getJobStatus(req.params.jobId);

  if (!job) {
    return res.status(404).json({
      error: "Job not found",
    });
  }

  res.json({
    jobId: req.params.jobId,

    ...job,
  });
});

/*
|--------------------------------------------------------------------------
| GET /articles
|--------------------------------------------------------------------------
*/

app.get("/articles", (req, res) => {
  try {
    const articles = db
      .prepare(
        `
          SELECT
            id,
            title,
            summary,
            body,
            source,
            url,
            published_at AS publishedAt
          FROM articles
          WHERE published_at >= ?
          ORDER BY published_at DESC
          `,
      )
      .all(NEWS_START);

    res.json(articles);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch articles",
    });
  }
});


/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    error: "Internal server error",
  });
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

app.listen(PORT, "0.0.0.0", () => {
  console.log(`News Pulse API running on port ${PORT}`);
});

