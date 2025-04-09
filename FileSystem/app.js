const fs = require("fs");
const path = require("path");

/**
 * @description this example shows how to read and write files using fs module
 * @author Eslam
 * @date 2023-10-01
 * Lecture 5
 */

let textIn = fs.readFileSync(
  path.join(__dirname, "Files", "input.txt"),
  "utf-8"
);
console.log(textIn);

let textOut = `This is the output file text\n ${textIn} \n this file created at ${new Date()}\n by Eslam`;
fs.writeFileSync(path.join(__dirname, "Files", "output.txt"), textOut, "utf-8");
