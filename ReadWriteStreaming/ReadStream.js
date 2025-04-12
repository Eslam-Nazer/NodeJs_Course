const fs = require("fs");
const path = require("path");
const http = require("http");

const server = http.createServer((req, res) => {
  console.log("Request received");
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Server is listening on port 3000");
});

// solution 1 use fs.readFile
// server.on("request", (req, res) => {
//    fs.readFile(
//     path.join(__dirname, "data", "dump_info.txt"),
//     "utf-8",
//     (err, data) => {
//       if (err) {
//         console.error("Error reading file:", err);
//         res.writeHead(500, { "Content-Type": "text/plain" });
//         res.end("Internal Server Error");
//         return;
//       }
//       res.end(data);
//     }
//   );
// });

// solution 2 use fs.createReadStream
// server.on("request", (req, res) => {
//   let rs = fs.createReadStream(
//     path.join(__dirname, "data", "dump_info.txt"),
//     "utf-8"
//   );

//   rs.on("data", (chunk) => {
//     res.write(chunk);
//   });

//   rs.on("end", () => {
//     res.end();
//   });

//   rs.on("error", (err) => {
//     console.error("Error reading file: ", err);
//     res.writeHead(500, { "Content-Type": "text/plan" });
//     res.end("Internal Server Error: " + err.message);
//   });
// });

// solution 3 use pipe
server.on("request", (req, res) => {
  let rs = fs.createReadStream(
    path.join(__dirname, "data", "dump_info.txt"),
    "utf-8"
  );
  rs.pipe(res);
});
