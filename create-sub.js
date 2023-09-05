const { pgp, db, db2 } = require("./db");
const { chunkArray } = require("./helper");

(async function () {
  const mdns = await db.task("get-subs", async (t) => {
    const q1 = await t.any(
      "select distinct mdn , rate_plan_code as plan_code , activation_date as created_at  from att_status_snapshots_06_23 ass where activation_date <> '' order by mdn;",
      []
    );

    return q1;
  });

  const result = preparePayload(mdns);
  console.log(result.length);
  const originalArray = result;
  const chunkSize = 1000;
  const arrayChunkPieces = chunkArray(originalArray, chunkSize);

  for (let piece of arrayChunkPieces) {
    const columnSet = new pgp.helpers.ColumnSet(
      [
        "mdn",
        "plan_code",
        "created_at",
        "updated_at",
        "operator_id",
        "customer_id",
        "tariff_code",
        "tariff_name",
        "type",
      ],
      { table: "subscriptions" }
    );
    const insertQuery = pgp.helpers.insert(piece, columnSet);
    try {
      await db2.none(insertQuery);
      // console.log("Batch insert successful");
    } catch (error) {
      console.error("Error performing batch insert:", error);
    } finally {
      // pgp.end();
    }
  }

  console.log("done");
})();

function preparePayload(data) {
  return data.map((item) => {
    const { created_at } = item;
    let y = created_at.substring(0, 4);
    let m = created_at.substring(4, 6);
    let d = created_at.substring(6, 8);

    const date = `${y}-${m}-${d}`;

    return {
      mdn: item.mdn,
      plan_code: item.plan_code,
      created_at: date,
      updated_at: date,
      operator_id: 1,
      customer_id: 99,
      tariff_code: item.plan_code,
      tariff_name: item.plan_code,
      type: "MAIN",
    };
  });
}
