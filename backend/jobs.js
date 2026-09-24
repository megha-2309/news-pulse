
const {
  spawn
} = require("child_process");

const path = require("path");

const jobs = new Map();
let activeJobId = null;

function createJobId() {
  return (
    `${Date.now()}-` +
    `${Math.random()
      .toString(36)
      .substring(2, 8)}`
  );
}

function startIngestionJob() {
  if (activeJobId) {
    const activeJob = jobs.get(activeJobId);
    if (activeJob?.status === "running") {
      return activeJobId;
    }
    activeJobId = null;
  }

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
      ? path.join(
          scraperDirectory,
          ".venv",
          "Scripts",
          "python.exe"
        )
      : "/opt/venv/bin/python";

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
    "error",
    (error) => {
      const job =
        jobs.get(jobId);

      if (!job) {
        return;
      }

      job.status =
        "failed";

      job.finishedAt =
        new Date().toISOString();

      job.error =
        error.message;

      job.output =
        output;

      jobs.set(
        jobId,
        job
      );
      activeJobId = null;
    }
  );

  pythonProcess.on(
    "close",
    (code) => {
      const job =
        jobs.get(jobId);

      if (!job) {
        return;
      }

      job.finishedAt =
        new Date().toISOString();

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
      activeJobId = null;
    }
  );

  activeJobId = jobId;

  return jobId;
}

function getJobStatus(jobId) {
  return jobs.get(
    jobId
  );
}

module.exports = {
  startIngestionJob,
  getJobStatus,
};

