"use client";

import Header from "./components/Header";
import SourceFilter from "./components/SourceFilter";
import Timeline from "./components/Timeline";
import ClusterDetails from "./components/ClusterDetails";
import Loading from "./components/Loading";
import ArticleSearch from "./components/ArticleSearch";
import { useNewsPulse } from "./hooks/useNewsPulse";

export default function Home() {
  const newsPulse = useNewsPulse();

  const allSelected =
    newsPulse.sources.length > 0 &&
    newsPulse.selectedSources.length === newsPulse.sources.length;

  const isSearching = newsPulse.searchQuery.trim().length > 0;

  const detailsCluster =
    (isSearching ? null : newsPulse.selectedCluster) ||
    (newsPulse.visibleArticles.length > 0
      ? {
          id: allSelected && !isSearching
            ? "all-sources"
            : "filtered-sources",
          label: allSelected && !isSearching
            ? "All articles"
            : "Filtered articles",
          articles: newsPulse.visibleArticles,
        }
      : null);

  return (
    <main className="page">
      <Header
        refreshing={newsPulse.refreshing}
        onRefresh={newsPulse.refreshData}
      />

      {newsPulse.error && (
        <div className="error">
          {newsPulse.error}
        </div>
      )}

      <SourceFilter
        sources={newsPulse.sources}
        selectedSources={newsPulse.selectedSources}
        onToggle={newsPulse.toggleSource}
        onToggleAll={newsPulse.toggleAllSources}
      />

      <ArticleSearch
        value={newsPulse.searchQuery}
        onChange={newsPulse.setSearchQuery}
      />

      <Timeline
        timeline={newsPulse.timeline}
        onClusterClick={newsPulse.openCluster}
        selectedClusterId={newsPulse.selectedCluster?.id}
      />

      {detailsCluster && newsPulse.visibleArticles.length > 0 && (
        <ClusterDetails
          cluster={detailsCluster}
          visibleArticles={newsPulse.visibleArticles}
          onClose={newsPulse.closeCluster}
          searchQuery={newsPulse.searchQuery}
        />
      )}
    </main>
  );
}