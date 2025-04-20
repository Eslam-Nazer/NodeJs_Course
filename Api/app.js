const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const app = express();
const port = 4000;

const logger = (req, res, next) => {
  console.log(`this is middleware: ${req.method} ${req.url}`);
  next();
};

app.use(express.json());
app.use(morgan("dev"));
app.use(logger);
app.use((req, res, next) => {
  req.requestAt = new Date().toISOString();
  next();
});

let movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));

const getAllMovies = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestAt,
    count: movies.length,
    data: {
      movies: movies,
    },
  });
};

const addNewMovie = (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      status: "fail",
      message: "No data provided",
    });
  }

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
};

const getMovieById = (request, response) => {
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
};

const updateMovieById = (request, response) => {
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
};

const deleteMovieById = (request, response) => {
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
};

/**
 * @description Get all movies
 * @route GET /api/movies
 */
// app.get("/api/movies", getAllMovies);

/**
 * @description Create a new movie
 * @route POST /api/movies
 */
// app.post("/api/movies", addNewMovie);

/**
 * @description Get a movie by ID
 * @route GET /api/movies/:id
 */
// app.get("/api/movies/:id", getMovieById);

/**
 * @description Update a movie by ID
 * @route PATCH /api/movies/:id
 */
// app.patch("/api/movies/:id", updateMovieById);

/**
 * @description Delete a movie by ID
 * @route DELETE /api/movies/:id
 */
// app.delete("/api/movies/:id", updateMovieById);

/**
 * @description refactoring the code and shane the methods
 */
app.route("/api/movies").get(getAllMovies).post(addNewMovie);
app
  .route("/api/movies/:id")
  .get(getMovieById)
  .patch(updateMovieById)
  .delete(deleteMovieById);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
