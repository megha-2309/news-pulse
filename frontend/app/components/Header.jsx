export default function Header({
  refreshing,
  onRefresh,
}) {
  return (
    <header className="header">

      <div>

        <p className="eyebrow">
          NEWS INTELLIGENCE
        </p>

        <h1>
          News Pulse
        </h1>

        <p className="subtitle">
          Topic-clustered news timeline
        </p>

      </div>

      <button
        className="refreshButton"
        onClick={onRefresh}
        disabled={refreshing}
      >
        {refreshing
          ? "Refreshing..."
          : "Refresh Data"
        }
      </button>

    </header>
  );
}