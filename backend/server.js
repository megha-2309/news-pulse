const express = require("express");

const cors = require("cors");

const db = require("./database");

const { startIngestionJob, getJobStatus } = require("./jobs");

const app = express();

const PORT = process.env.PORT || 4000;

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
          GROUP BY c.id
          ORDER BY startTime DESC
          `,
      )
      .all();

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
          `,
      )
      .get(req.params.id);

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
          ORDER BY
            published_at ASC
          `,
      )
      .all(req.params.id);

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
          ORDER BY source ASC
          `,
      )
      .all();

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
          GROUP BY c.id
          ORDER BY startTime ASC
          `,
      )
      .all();

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
