const fs = require("fs");
const { Worker, isMainThread } = require("worker_threads");

if (isMainThread) {
  console.log("Worker main started");
  fs.readdirSync("output").forEach((file) => {
    console.log(`Processing ${file}`);
    const worker = new Worker("./save.js", {
      workerData: {
        filePath: `output/${file}`,
      },
    });

    worker.on("message", (message) => {
      console.log(message);
    });

    worker.on("error", (error) => {
      console.error("Worker error:", error);
    });

    worker.on("exit", (code) => {
      console.log(`Worker exited with code ${code}`);
    });
  });
} else {
  console.log("Worker thread started");
}
