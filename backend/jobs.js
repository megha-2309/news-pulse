const {
  spawn
} = require("child_process");


const path = require("path");


const jobs = new Map();


function createJobId() {

  return (
    `${Date.now()}-` +
    `${Math.random()
      .toString(36)
      .substring(2, 8)}`
  );
}


function startIngestionJob() {

  const jobId =
    createJobId();


  jobs.set(
    jobId,
    {
      status: "running",

      startedAt:
        new Date().toISOString(),

      finishedAt:
        null,

      error:
        null,

      output:
        "",
    }
  );


  const scraperDirectory =
    path.join(
      __dirname,
      "..",
      "scraper"
    );


  const pythonCommand =
    process.platform === "win32"
      ? "python"
      : "python3";


  const pythonProcess =
    spawn(
      pythonCommand,
      ["main.py"],
      {
        cwd:
          scraperDirectory,
      }
    );


  let output = "";


  pythonProcess.stdout.on(
    "data",
    (data) => {

      output +=
        data.toString();

    }
  );


  pythonProcess.stderr.on(
    "data",
    (data) => {

      output +=
        data.toString();

    }
  );


  pythonProcess.on(
    "close",
    (code) => {

      const job =
        jobs.get(
          jobId
        );


      if (!job) {
        return;
      }


      job.finishedAt =
        new Date()
          .toISOString();


      job.output =
        output;


      if (code === 0) {

        job.status =
          "completed";

      } else {

        job.status =
          "failed";

        job.error =
          `Python process exited with code ${code}`;
      }


      jobs.set(
        jobId,
        job
      );

    }
  );


  return jobId;
}


function getJobStatus(
  jobId
) {

  return jobs.get(
    jobId
  );

}


module.exports = {
  startIngestionJob,
  getJobStatus,
};