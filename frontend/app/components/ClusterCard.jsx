
export default function ClusterCard({
  cluster,
  onClick,
  selected = false,
}) {
  return (
    <button
      className={`clusterCard${selected ? " clusterCardSelected" : ""}`}
      onClick={() => onClick(cluster.id)}
    >
      <strong className="clusterLabel">
        {cluster.label}
      </strong>

      <span className="articleCount">
        {cluster.articleCount}{" "}
        {cluster.articleCount === 1
          ? "article"
          : "articles"}
      </span>
    </button>
  );
}
