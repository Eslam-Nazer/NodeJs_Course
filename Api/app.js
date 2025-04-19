const express = require("express");
const fs = require("fs");
const app = express();
const port = 4000;

app.use(express.json());

let movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));

app.get("/api/movies", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      movies,
    },
  });
});

app.post("/api/movies", (req, res) => {
  const newId = movies[movies.length - 1].id + 1;

  let newMove = Object.assign({ id: newId }, req.body);

  movies.push(newMove);

  fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
    if (err) {
      res.status(500).json({
        status: "fail",
        message: "Error writing to file",
      });
    }

    res.status(201).json({
      status: "success",
      data: {
        movie: newMove,
      },
    });
  });
  // res.send("Movie added successfully");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
