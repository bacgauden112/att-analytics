const fs = require("node:fs");

const appendToFile = (fileName, line) => {
  fs.appendFile(`output/${fileName}`, line + "\n", function (err) {
    if (err) throw err;
    // console.log("Saved!");
  });
};

const chunkArray = (array, chunkSize) => {
  const chunkedArrays = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunkedArrays.push(chunk);
  }

  return chunkedArrays;
};

module.exports = {
  appendToFile,
  chunkArray,
};
