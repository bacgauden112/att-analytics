const { pgp, db } = require("./db");
const ExcelJS = require("exceljs");

const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet("summary");
const codes = [
  "AV01",
  "AV02",
  "AV03",
  "AV04",
  "AV05",
  "AV06",
  "AV07",
  "AV08",
  "AV09",
  "AV11",
  "AV12",
  "AV13",
  "AV14",
  "AV15",
  "AV16",
  "AV17",
];

(async function () {
  const result = [];
  let col = "A";
  for (let code of codes) {
    sheet.getCell(`${col}1`).value = code;
    let row = 2;

    for (let i = 0; i < 30; i++) {
      const date = `2023-06-${i + 1}`;
      const q1 = await query(date, code);
      sheet.getCell(`${col}${row}`).value = q1[0].count;
      row++;
    }
    col = String.fromCharCode(col.charCodeAt(0) + 1);
  }
  await workbook.xlsx.writeFile("result.xlsx");
  process.exit();
})();

async function query(date, plan_code) {
  return db.any(
    `select count(*)
    from (select mdn
    from att_status_snapshots_06_23 ass
    where
    activation_date <= $1
    and expiration_date >= $1
    and rate_plan_code = $2
    group by mdn) as total ;`,
    [date, plan_code]
  );
}
