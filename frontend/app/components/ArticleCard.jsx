export default function ArticleCard({
  article,
  searchQuery = "",
}) {
  return (
    <article className="article">

      <div>

        <span className="articleSource">
          {highlightMatches(article.source, searchQuery)}
        </span>

        <span className="articleDate">
          {formatDate(article.publishedAt)}
        </span>

      </div>


      <h3>
        {highlightMatches(article.title, searchQuery)}
      </h3>


      <p>
        {highlightMatches(article.summary, searchQuery)}
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

function highlightMatches(text = "", query = "") {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return text;
  }

  const escapedQuery = trimmedQuery.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
  const parts = text.split(
    new RegExp(`(${escapedQuery})`, "gi")
  );

  return parts.map((part, index) =>
    part.toLowerCase() === trimmedQuery.toLowerCase() ? (
      <mark className="searchHighlight" key={`${part}-${index}`}>
        {part}
      </mark>
    ) : (
      part
    )
  );
}