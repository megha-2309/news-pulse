"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getTimeline,
  getSources,
  getCluster,
  triggerIngestion,
  getIngestionStatus,
} from "../lib/api";

export function useNewsPulse() {
  // Timeline data

  const [timeline, setTimeline] = useState([]);

  // Currently selected cluster

  const [selectedCluster, setSelectedCluster] = useState(null);

  // Available news sources

  const [sources, setSources] = useState([]);

  // Currently selected sources

  const [selectedSources, setSelectedSources] = useState([]);

  // Initial page loading

  const [loading, setLoading] = useState(true);

  // Refresh button loading

  const [refreshing, setRefreshing] = useState(false);

  // Error message

  const [error, setError] = useState("");

  // Load data when page opens

  useEffect(() => {
    loadData();
  }, []);

  // Load timeline + sources

  async function loadData() {
    try {
      setLoading(true);

      setError("");

      const timelineData = await getTimeline();

      setTimeline(timelineData);

      const sourceData = await getSources();

      setSources(sourceData);

      // Initially select all sources

      setSelectedSources(sourceData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Open selected cluster

  async function openCluster(clusterId) {
    try {
      setError("");

      const data = await getCluster(clusterId);

      setSelectedCluster(data);
    } catch (error) {
      setError(error.message);
    }
  }

  // Close cluster details

  function closeCluster() {
    setSelectedCluster(null);
  }

  // Toggle one source

  function toggleSource(source) {
    setSelectedSources((current) => {
      if (current.includes(source)) {
        return current.filter((item) => item !== source);
      }

      return [...current, source];
    });
  }

  // Toggle all sources

  function toggleAllSources() {
    if (selectedSources.length === sources.length) {
      setSelectedSources([]);
    } else {
      setSelectedSources(sources);
    }
  }

  // Refresh news data

  async function refreshData() {
    try {
      setRefreshing(true);

      setError("");

      // Start ingestion

      const job = await triggerIngestion();

      let status = "running";

      // Keep checking until job finishes

      while (status === "running") {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const statusData = await getIngestionStatus(job.jobId);

        status = statusData.status;

        if (status === "failed") {
          throw new Error(statusData.error || "Ingestion failed");
        }
      }

      // Load fresh data

      await loadData();

      // Close currently opened cluster

      setSelectedCluster(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setRefreshing(false);
    }
  }

  // Articles visible after source filtering

  const visibleArticles = useMemo(() => {
    if (!selectedCluster) {
      return [];
    }

    return selectedCluster.articles.filter((article) =>
      selectedSources.includes(article.source),
    );
  }, [selectedCluster, selectedSources]);

  // Return everything page needs

  return {
    timeline,

    selectedCluster,

    sources,

    selectedSources,

    visibleArticles,

    loading,

    refreshing,

    error,

    openCluster,

    closeCluster,

    toggleSource,

    toggleAllSources,

    refreshData,
  };
}
