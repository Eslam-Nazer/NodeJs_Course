const express = require("express");
const fs = require("fs");
const app = express();
const port = 4000;

let movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));

app.get("/api/movies", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      movies,
    },
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
