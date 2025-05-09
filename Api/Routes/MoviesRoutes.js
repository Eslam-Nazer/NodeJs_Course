const express = require("express");
const moviesController = require("./../Controller/MoviesController");
const AuthController = require("./../Controller/AuthController");

const router = express.Router();

router.route("/stats").get(moviesController.getMoviesStats);

router
    .route("/")
    .get(AuthController.protected, moviesController.getAllMovies)
    .post(AuthController.protected, moviesController.validateMovies, moviesController.addNewMovie);
router
    .route("/:id")
    .get(AuthController.protected, moviesController.getMovieById)
    .patch(AuthController.protected, AuthController.restrict('admin'), moviesController.updateMovieById)
    .delete(AuthController.protected, AuthController.restrict('admin'), moviesController.deleteMovieById);

module.exports = router;
