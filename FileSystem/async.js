const fs = require("fs");
const path = require("path");

fs.readFile(
  path.join(__dirname, "Files", "start.txt"),
  "utf-8",
  (err, data) => {
    if (err) {
      console.log("Error in reading file", err);
      process.exit(0);
    }

    console.log("Data from file", data);

    fs.writeFile(
      path.join(__dirname, "Files", "output_end.txt"),
      data,
      "utf-8",
      (err) => {
        if (err) {
          console.log("Error in writing file", err);
          process.exit(0);
        }

        console.log("File written successfully");
      }
    );
  }
);
