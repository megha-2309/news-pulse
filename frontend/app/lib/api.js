const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://news-pulse-ff0m.onrender.com";


// Get timeline

export async function getTimeline() {
  const response = await fetch(
    `${API_URL}/timeline`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load timeline"
    );
  }

  return response.json();
}


// Get news sources

export async function getSources() {
  const response = await fetch(
    `${API_URL}/sources`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load sources"
    );
  }

  return response.json();
}


// Get all articles

export async function getArticles() {
  const response = await fetch(`${API_URL}/articles`);

  if (!response.ok) {
    throw new Error("Failed to load articles");
  }

  return response.json();
}


// Get one cluster

export async function getCluster(
  clusterId
) {
  const response = await fetch(
    `${API_URL}/clusters/${clusterId}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load cluster"
    );
  }

  return response.json();
}


// Start ingestion

export async function triggerIngestion() {
  const response = await fetch(
    `${API_URL}/ingest/trigger`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Could not start ingestion"
    );
  }

  return response.json();
}


// Check ingestion status

export async function getIngestionStatus(
  jobId
) {
  const response = await fetch(
    `${API_URL}/ingest/status/${jobId}`
  );

  if (!response.ok) {
    throw new Error(
      "Could not check ingestion status"
    );
  }

  return response.json();
}