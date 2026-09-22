export default function ClusterCard({
  cluster,
  onClick,
}) {
  return (
    <button
      className="clusterCard"
      onClick={() => onClick(cluster.id)}
      style={{
        minHeight: `${Math.max(
          80,
          cluster.intensity
        )}px`,
      }}
    >
      <span className="clusterDate">
        {formatDate(cluster.startTime)}
      </span>

      <strong>
        {cluster.label}
      </strong>

      <span>
        {cluster.articleCount} articles
      </span>

      <small>
        {formatDate(cluster.endTime)}
      </small>
    </button>
  );
}


function formatDate(value) {
  return new Date(value).toLocaleString();
}