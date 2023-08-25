const fs = require("node:fs");
const { workerData, parentPort } = require("worker_threads");
const readline = require("node:readline");
const { appendToFile } = require("./helper");

const filePath = workerData.filePath;

const rl = readline.createInterface({
  input: fs.createReadStream(filePath),
  crlfDelay: Infinity,
});

rl.on("line", async (line) => {
  if (line[0] === "S") {
    appendToFile(filePath.split("/")[1], line);
    // parentPort.postMessage({ message: "File processed successfully" });
  }
});

rl.on("close", () => {
  parentPort.postMessage({
    message: `File processed successfully: ${filePath}`,
  });
});
