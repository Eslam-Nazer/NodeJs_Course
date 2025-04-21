const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const app = express();
const port = 4000;

const logger = (req, res, next) => {
  console.log(`this is middleware: ${req.method} ${req.url}`);
  next();
};

app.use(express.json());
dotenv.config({ path: "./config.env" });
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(logger);
app.use((req, res, next) => {
  req.requestAt = new Date().toISOString();
  next();
});

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
const moviesRouter = require("./Routes/MoviesRoutes");
app.use("/api/movies", moviesRouter);

module.exports = app;
