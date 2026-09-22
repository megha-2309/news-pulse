import ClusterCard from "./ClusterCard";

export default function Timeline({
  timeline,
  onClusterClick,
}) {
  return (
    <section className="timelineSection">

      <div className="timelineAxis">

        <span>
          Earlier
        </span>

        <span>
          Current
        </span>

      </div>


      <div className="timeline">

        {timeline.map((cluster) => (

          <ClusterCard
            key={cluster.id}
            cluster={cluster}
            onClick={onClusterClick}
          />

        ))}

      </div>

    </section>
  );
}