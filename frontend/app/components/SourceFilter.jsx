export default function SourceFilter({
  sources,
  selectedSources,
  onToggle,
  onToggleAll,
}) {
  const allSelected =
    sources.length > 0 &&
    selectedSources.length === sources.length;

  return (
    <section className="filters">

      <strong>
        News Sources
      </strong>

      {/* All checkbox */}

      <label className="sourceOption">

        <input
          type="checkbox"
          checked={allSelected}
          onChange={onToggleAll}
        />

        All

      </label>


      {/* Individual source checkboxes */}

      {sources.map((source) => (

        <label
          key={source}
          className="sourceOption"
        >

          <input
            type="checkbox"
            checked={selectedSources.includes(source)}
            onChange={() => onToggle(source)}
          />

          {source}

        </label>

      ))}

    </section>
  );
}