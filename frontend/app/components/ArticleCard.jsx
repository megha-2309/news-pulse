export default function ArticleCard({
  article,
}) {
  return (
    <article className="article">

      <div>

        <span className="articleSource">
          {article.source}
        </span>

        <span className="articleDate">
          {formatDate(article.publishedAt)}
        </span>

      </div>


      <h3>
        {article.title}
      </h3>


      <p>
        {article.summary}
      </p>


      <a
        href={article.url}
        target="_blank"
        rel="noreferrer"
      >
        Read original article →
      </a>

    </article>
  );
}


function formatDate(value) {
  return new Date(value).toLocaleString();
}