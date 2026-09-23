



import ClusterCard from "./ClusterCard";

export default function Timeline({
  timeline,
  onClusterClick,
  selectedClusterId,
}) {
  if (!timeline || timeline.length === 0) {
    return (
      <section className="timelineSection">
        <div className="timelineEmpty">
          No news clusters available.
        </div>
      </section>
    );
  }

  const orderedTimeline = [...timeline].sort(
    (a, b) =>
      new Date(a.startTime).getTime() -
      new Date(b.startTime).getTime()
  );

  return (
    <section className="timelineSection">
      <div className="timelineHeader">
        <div>
          <p className="eyebrow">NEWS TIMELINE</p>
          <h2>Topic activity over time</h2>
        </div>

        <span className="timelineCount">
          {orderedTimeline.length} Topics
        </span>
      </div>

      <div className="timelineTopicGrid">
        {orderedTimeline.map((cluster) => (
          <ClusterCard
            key={cluster.id}
            cluster={cluster}
            onClick={onClusterClick}
                  selected={cluster.id === selectedClusterId}
          />
        ))}
      </div>
    </section>
  );
}

