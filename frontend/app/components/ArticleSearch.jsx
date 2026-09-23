export default function ArticleSearch({ value, onChange }) {
  return (
    <div className="articleSearch">
      <label htmlFor="article-search">Search articles</label>
      <input
        id="article-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title, topic, source..."
      />
    </div>
  );
}