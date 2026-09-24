



"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  getTimeline,
  getSources,
  getCluster,
  getArticles,
  triggerIngestion,
  getIngestionStatus,
} from "../lib/api";

export function useNewsPulse() {
  const [timeline, setTimeline] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [allArticles, setAllArticles] = useState([]);
  const [sources, setSources] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const requestVersion = useRef(0);

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      refreshData();
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

async function loadData() {
  const currentRequestVersion = ++requestVersion.current;

  try {
    setError("");

    const timelineData = await getTimeline();
    setTimeline(timelineData);

    const sourceData = await getSources();
    setSources(sourceData);

    setSelectedSources((current) => {
      const allWereSelected =
        current.length === sources.length;

      if (current.length === 0 || allWereSelected) {
        return sourceData;
      }

      return sourceData.filter((source) =>
        current.includes(source)
      );
    });

    const articles = await getArticles();
    setAllArticles(articles);
  } catch (error) {
    if (currentRequestVersion === requestVersion.current) {
      setError(error.message);
    }
  }
}

  async function openCluster(clusterId) {
    if (refreshing) {
      return;
    }

    const currentRequestVersion = ++requestVersion.current;

    try {
      setError("");
      setSearchQuery("");

      let data;

      try {
        data = await getCluster(clusterId);
      } catch (firstError) {
        await loadData();
        data = await getCluster(clusterId);
      }

      if (currentRequestVersion === requestVersion.current) {
        setSelectedCluster(data);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  function closeCluster() {
    setSelectedCluster(null);
  }

  function toggleSource(source) {
    setSelectedSources((current) => {
      const next = new Set(current);

      if (next.has(source)) {
        next.delete(source);
      } else {
        next.add(source);
      }

      return Array.from(next);
    });

    setSelectedCluster(null);
  }

  function toggleAllSources() {
    const allCurrentlySelected =
      selectedSources.length === sources.length;

    setSelectedSources(
      allCurrentlySelected ? [] : [...sources]
    );
    setSelectedCluster(null);
  }

  async function refreshData() {
    try {
      requestVersion.current += 1;
      setSelectedCluster(null);
      setRefreshing(true);
      setError("");

      const job = await triggerIngestion();

      let status = "running";

      while (status === "running") {
        await new Promise((resolve) =>
          setTimeout(resolve, 2000)
        );

        const statusData =
          await getIngestionStatus(job.jobId);

        status = statusData.status;

        if (status === "failed") {
          throw new Error(
            statusData.error ||
              "Ingestion failed"
          );
        }
      }

      await loadData();
    } catch (error) {
      setError(error.message);
    } finally {
      setRefreshing(false);
    }
  }

  const visibleArticles = useMemo(() => {
    const allSelected =
      sources.length > 0 &&
      selectedSources.length === sources.length;

    const newestFirst = (articles) =>
      [...articles].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
      );

    const matchesSearch = (article) => {
      const query = searchQuery.trim().toLowerCase();

      if (!query) {
        return true;
      }

      return [
        article.title,
        article.summary,
        article.source,
      ]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(query)
        );
    };

    if (selectedSources.length === 0) {
      return [];
    }

    if (searchQuery.trim()) {
      return newestFirst(
        allArticles.filter(
          (article) =>
            selectedSources.includes(article.source) &&
            matchesSearch(article)
        )
      );
    }

    if (selectedCluster) {
      if (allSelected) {
        return newestFirst(
          (selectedCluster.articles || allArticles).filter(
            matchesSearch
          )
        );
      }

      return newestFirst(
        (selectedCluster.articles || []).filter(
          (article) =>
            selectedSources.includes(article.source) &&
            matchesSearch(article)
        )
      );
    }

    if (allSelected) {
      return newestFirst(allArticles.filter(matchesSearch));
    }

    return newestFirst(
      allArticles.filter((article) =>
        selectedSources.includes(article.source) &&
        matchesSearch(article)
      )
    );
  }, [
    selectedCluster,
    selectedSources,
    allArticles,
    sources,
    searchQuery,
  ]);

  return {
    timeline,
    selectedCluster,
    sources,
    selectedSources,
    searchQuery,
    setSearchQuery,
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
