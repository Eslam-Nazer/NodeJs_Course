const express = require("express");
const moviesController = require("./../Controller/MoviesController");

const router = express.Router();

router.route("/stats").get(moviesController.getMoviesStats);

router
  .route("/")
  .get(moviesController.getAllMovies)
  .post(moviesController.validateMovies, moviesController.addNewMovie);
router
  .route("/:id")
  .get(moviesController.getMovieById)
  .patch(moviesController.updateMovieById)
  .delete(moviesController.deleteMovieById);

module.exports = router;
