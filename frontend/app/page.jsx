// "use client";

// import {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";


// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL ||
//   "http://localhost:4000";


// export default function Home() {

//   const [
//     timeline,
//     setTimeline
//   ] = useState([]);


//   const [
//     selectedCluster,
//     setSelectedCluster
//   ] = useState(null);


//   const [
//     sources,
//     setSources
//   ] = useState([]);


//   const [
//     selectedSources,
//     setSelectedSources
//   ] = useState([]);


//   const [
//     loading,
//     setLoading
//   ] = useState(true);


//   const [
//     refreshing,
//     setRefreshing
//   ] = useState(false);


//   const [
//     error,
//     setError
//   ] = useState("");


//   useEffect(
//     () => {
//       loadTimeline();
//     },
//     []
//   );


//   async function loadTimeline() {

//     try {

//       setLoading(true);

//       setError("");


//       const response =
//         await fetch(
//           `${API_URL}/timeline`
//         );


//       if (!response.ok) {

//         throw new Error(
//           "Failed to load timeline"
//         );

//       }


//       const data =
//         await response.json();


//       setTimeline(data);


//       await loadSources();

//     } catch (error) {

//       setError(
//         error.message
//       );

//     } finally {

//       setLoading(false);

//     }

//   }


//   async function loadSources() {

//     const response =
//       await fetch(
//         `${API_URL}/sources`
//       );


//     if (!response.ok) {
//       return;
//     }


//     const data =
//       await response.json();


//     setSources(data);

//     setSelectedSources(data);

//   }


//   async function openCluster(
//     clusterId
//   ) {

//     try {

//       setError("");


//       const response =
//         await fetch(
//           `${API_URL}/clusters/${clusterId}`
//         );


//       if (!response.ok) {

//         throw new Error(
//           "Failed to load cluster"
//         );

//       }


//       const data =
//         await response.json();


//       setSelectedCluster(
//         data
//       );

//     } catch (error) {

//       setError(
//         error.message
//       );

//     }

//   }


//   function toggleSource(
//     source
//   ) {

//     setSelectedSources(
//       current => {

//         if (
//           current.includes(
//             source
//           )
//         ) {

//           return current.filter(
//             item =>
//               item !== source
//           );

//         }


//         return [
//           ...current,
//           source,
//         ];

//       }
//     );

//   }


//   async function refreshData() {

//     try {

//       setRefreshing(true);

//       setError("");


//       const triggerResponse =
//         await fetch(
//           `${API_URL}/ingest/trigger`,
//           {
//             method: "POST",
//           }
//         );


//       if (!triggerResponse.ok) {

//         throw new Error(
//           "Could not start ingestion"
//         );

//       }


//       const job =
//         await triggerResponse.json();


//       let status =
//         "running";


//       while (
//         status === "running"
//       ) {

//         await new Promise(
//           resolve =>
//             setTimeout(
//               resolve,
//               2000
//             )
//         );


//         const statusResponse =
//           await fetch(
//             `${API_URL}/ingest/status/${job.jobId}`
//           );


//         if (
//           !statusResponse.ok
//         ) {

//           throw new Error(
//             "Could not check ingestion status"
//           );

//         }


//         const statusData =
//           await statusResponse.json();


//         status =
//           statusData.status;


//         if (
//           status === "failed"
//         ) {

//           throw new Error(
//             statusData.error ||
//             "Ingestion failed"
//           );

//         }

//       }


//       await loadTimeline();

//       setSelectedCluster(
//         null
//       );

//     } catch (error) {

//       setError(
//         error.message
//       );

//     } finally {

//       setRefreshing(false);

//     }

//   }


//   const visibleArticles =
//     useMemo(
//       () => {

//         if (
//           !selectedCluster
//         ) {
//           return [];
//         }


//         return (
//           selectedCluster.articles
//             .filter(
//               article =>
//                 selectedSources.includes(
//                   article.source
//                 )
//             )
//         );

//       },
//       [
//         selectedCluster,
//         selectedSources,
//       ]
//     );


//   if (loading) {

//     return (
//       <main className="page">

//         <div className="loading">

//           Loading News Pulse...

//         </div>

//       </main>
//     );

//   }


//   return (

//     <main className="page">

//       <header className="header">

//         <div>

//           <p className="eyebrow">
//             NEWS INTELLIGENCE
//           </p>


//           <h1>
//             News Pulse
//           </h1>


//           <p className="subtitle">
//             Topic-clustered news timeline
//           </p>

//         </div>


//         <button
//           className="refreshButton"
//           onClick={
//             refreshData
//           }
//           disabled={
//             refreshing
//           }
//         >

//           {
//             refreshing
//               ? "Refreshing..."
//               : "Refresh Data"
//           }

//         </button>

//       </header>


//       {error && (

//         <div className="error">

//           {error}

//         </div>

//       )}


//     <section className="filters">

//   <strong>
//     News Sources
//   </strong>

//   <label className="sourceOption">

//     <input
//       type="checkbox"
//       checked={
//         selectedSources.length === sources.length
//       }
//       onChange={() => {

//         if (
//           selectedSources.length === sources.length
//         ) {

//           setSelectedSources([]);

//         } else {

//           setSelectedSources(sources);

//         }

//       }}
//     />

//     All

//   </label>


//   {sources.map(
//     source => (

//       <label
//         key={source}
//         className="sourceOption"
//       >

//         <input
//           type="checkbox"
//           checked={
//             selectedSources.includes(
//               source
//             )
//           }
//           onChange={() =>
//             toggleSource(source)
//           }
//         />

//         {source}

//       </label>

//     )
//   )}

// </section>

//       <section className="timelineSection">

//         <div className="timelineAxis">

//           <span>
//             Earlier
//           </span>

//           <span>
//             Current
//           </span>

//         </div>


//         <div className="timeline">

//           {timeline.map(
//             cluster => (

//               <button
//                 key={
//                   cluster.id
//                 }
//                 className="clusterCard"
//                 onClick={
//                   () =>
//                     openCluster(
//                       cluster.id
//                     )
//                 }
//                 style={{
//                   minHeight:
//                     `${Math.max(
//                       80,
//                       cluster.intensity
//                     )}px`,
//                 }}
//               >

//                 <span
//                   className="clusterDate"
//                 >

//                   {
//                     formatDate(
//                       cluster.startTime
//                     )
//                   }

//                 </span>


//                 <strong>

//                   {
//                     cluster.label
//                   }

//                 </strong>


//                 <span>

//                   {
//                     cluster.articleCount
//                   }{" "}
//                   articles

//                 </span>


//                 <small>

//                   {
//                     formatDate(
//                       cluster.endTime
//                     )
//                   }

//                 </small>

//               </button>

//             )
//           )}

//         </div>

//       </section>


//       {selectedCluster && (

//         <section className="details">

//           <div className="detailsHeader">

//             <div>

//               <p className="eyebrow">
//                 TOPIC CLUSTER
//               </p>


//               <h2>

//                 {
//                   selectedCluster.label
//                 }

//               </h2>

//             </div>


//             <button
//               className="closeButton"
//               onClick={
//                 () =>
//                   setSelectedCluster(
//                     null
//                   )
//               }
//             >

//               Close

//             </button>

//           </div>


//           <div className="articles">

//             {visibleArticles.map(
//               article => (

//                 <article
//                   key={
//                     article.id
//                   }
//                   className="article"
//                 >

//                   <div>

//                     <span
//                       className="articleSource"
//                     >

//                       {
//                         article.source
//                       }

//                     </span>


//                     <span
//                       className="articleDate"
//                     >

//                       {
//                         formatDate(
//                           article.publishedAt
//                         )
//                       }

//                     </span>

//                   </div>


//                   <h3>

//                     {
//                       article.title
//                     }

//                   </h3>


//                   <p>

//                     {
//                       article.summary
//                     }

//                   </p>


//                   <a
//                     href={
//                       article.url
//                     }
//                     target="_blank"
//                     rel="noreferrer"
//                   >

//                     Read original article →

//                   </a>

//                 </article>

//               )
//             )}

//           </div>

//         </section>

//       )}

//     </main>

//   );

// }


// function formatDate(
//   value
// ) {

//   return new Date(
//     value
//   ).toLocaleString();

// }

"use client";

import Header from "./components/Header";
import SourceFilter from "./components/SourceFilter";
import Timeline from "./components/Timeline";
import ClusterDetails from "./components/ClusterDetails";
import Loading from "./components/Loading";

import { useNewsPulse } from "./hooks/useNewsPulse";

export default function Home() {
  const newsPulse = useNewsPulse();

  if (newsPulse.loading) {
    return <Loading />;
  }

  return (
    <main className="page">

      <Header
        refreshing={newsPulse.refreshing}
        onRefresh={newsPulse.refreshData}
      />

      {newsPulse.error && (
        <div className="error">
          {newsPulse.error}
        </div>
      )}

      <SourceFilter
        sources={newsPulse.sources}
        selectedSources={newsPulse.selectedSources}
        onToggle={newsPulse.toggleSource}
        onToggleAll={newsPulse.toggleAllSources}
      />

      <Timeline
        timeline={newsPulse.timeline}
        onClusterClick={newsPulse.openCluster}
      />

      {newsPulse.selectedCluster && (
        <ClusterDetails
          cluster={newsPulse.selectedCluster}
          visibleArticles={newsPulse.visibleArticles}
          onClose={newsPulse.closeCluster}
        />
      )}

    </main>
  );
}