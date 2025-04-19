const express = require("express");
const fs = require("fs");
const app = express();
const port = 4000;

app.use(express.json());

let movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));

/**
 * @description Get all movies
 * @route GET /api/movies
 */
app.get("/api/movies", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      movies: movies,
    },
  });
});

/**
 * @description Create a new movie
 * @route POST /api/movies
 */
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

/**
 * @description Get a movie by ID
 * @route GET /api/movies/:id
 */
app.get("/api/movies/:id", (request, response) => {
  const id = request.params.id;

  let movie = movies.find((el) => el.id === Number(id));

  console.log();
  if (!movie) {
    return response.status(404).json({
      status: "fail",
      message: "Movie not found",
    });
  }

  response.status(200).json({
    status: "success",
    data: {
      movie: movie,
    },
  });
});

/**
 * @description Update a movie by ID
 * @route PATCH /api/movies/:id
 */
app.patch("/api/movies/:id", (request, response) => {
  if (!request.body) {
    return response.status(400).json({
      status: "fail",
      message: "No data provided",
    });
  }

  const id = request.params.id;

  let movie = movies.find((el) => el.id === Number(id));

  if (!movie) {
    return response.status(404).json({
      status: "fail",
      message: "Movie not found",
    });
  }

  const index = movies.indexOf(movie);

  movie = Object.assign(movie, request.body);
  movies[index] = movie;

  fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
    if (err) {
      return response.status(500).json({
        status: "fail",
        message: "Error writing to file",
      });
    }

    response.status(200).json({
      status: "success",
      data: {
        movie: movie,
      },
    });
  });
});

/**
 * @description Delete a movie by ID
 * @route DELETE /api/movies/:id
 */
app.delete("/api/movies/:id", (request, response) => {
  if (!request.params) {
    response.status(400).json({
      status: "fail",
      message: "No data provided",
    });
  }

  const id = request.params.id;

  let movie = movies.find((el) => el.id === Number(id));

  if (!movie) {
    return response.status(404).json({
      status: "fail",
      message: "Movie not found",
    });
  }

  const index = movies.indexOf(movie);

  movies.splice(index, 1);

  fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
    if (err) {
      return response.status(500).json({
        status: "fail",
        message: "Error writing to file",
      });
    }

    response.status(204).json({
      status: "success",
      data: null,
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
