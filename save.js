const fs = require("node:fs");
const readline = require("node:readline");
const { pgp, db } = require("./db");
const { chunkArray } = require("./helper");
const { workerData, parentPort } = require("worker_threads");

const filePath = workerData.filePath;
const fileName = filePath.split("/")[1];

const rl = readline.createInterface({
  input: fs.createReadStream(filePath),
  crlfDelay: Infinity,
});

const data = [];

rl.on("line", async (line) => {
  if (line[0] === "S") {
    let payload = {};
    const cols = line.split("|");
    payload.mdn = cols[1];
    payload.master_mdn = cols[2];
    payload.service_class = cols[3];
    payload.rate_plan = cols[4];
    payload.status = cols[5];
    payload.activation_date = cols[6];
    payload.expiration_date = cols[7];
    payload.cancel_date = cols[8];
    payload.market = cols[9];
    payload.sub_market = cols[10];
    payload.last_airdate = cols[11];
    payload.balance = cols[12];
    payload.rate_plan_code = cols[13];
    payload.batch_date = cols[14];
    payload.filename = fileName;
    payload.date_imported = new Date();
    data.push(payload);
  }
});

rl.on("close", async () => {
  console.log(data.length);
  const originalArray = data;
  const chunkSize = 1000;
  const arrayChunkPieces = chunkArray(originalArray, chunkSize);

  for (let piece of arrayChunkPieces) {
    const columnSet = new pgp.helpers.ColumnSet(
      [
        "mdn",
        "master_mdn",
        "service_class",
        "rate_plan",
        "status",
        "activation_date",
        "expiration_date",
        "cancel_date",
        "market",
        "sub_market",
        "last_airdate",
        "balance",
        "rate_plan_code",
        "batch_date",
        "filename",
        "date_imported",
      ],
      { table: "att_status_snapshots_06_23" }
    );
    const insertQuery = pgp.helpers.insert(piece, columnSet);
    try {
      await db.none(insertQuery);
      // console.log("Batch insert successful");
    } catch (error) {
      console.error("Error performing batch insert:", error);
    } finally {
      // pgp.end();
    }
  }
  parentPort.postMessage({
    message: `File processed successfully: ${filePath}`,
  });
});
