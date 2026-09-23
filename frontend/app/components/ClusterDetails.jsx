import ArticleCard from "./ArticleCard";

export default function ClusterDetails({
  cluster,
  visibleArticles,
  onClose,
  searchQuery,
}) {
  return (
    <section className="details">

      <div className="detailsHeader">

        <div>

          <p className="eyebrow">
            TOPIC CLUSTER
          </p>

          <h2>
            {cluster.label}
          </h2>

        </div>


        <button
          className="closeButton"
          onClick={onClose}
        >
          Close
        </button>

      </div>


      <div className="articles">

        {visibleArticles.map((article) => (

          <ArticleCard
            key={article.id}
            article={article}
            searchQuery={searchQuery}
          />

        ))}

      </div>

    </section>
  );
}