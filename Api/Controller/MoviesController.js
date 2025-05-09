const fs = require("fs");
const {body, validationResult} = require("express-validator");
let movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));
/**
 * @type {import("mongoose").Model<import('./../Model/MovieModel')>}
 */
const moviesModel = require("./../Model/MovieModel");
const ApiFeatures = require("./../Utils/ApiFeatures");
const asyncErrorHandler = require("./../Utils/AsyncErrorHandler");

exports.validateMovies = [
    body("name").notEmpty().withMessage("Name is required").isString(),
    body("description")
        .notEmpty()
        .withMessage("description is required")
        .isString(),
    body("duration").notEmpty().isNumeric(),
    body("rating").optional().isNumeric(),
    body("totalRatings").optional().isNumeric(),
    body("releaseYear").notEmpty().isNumeric(),
    body("releaseDate").notEmpty(),
    body("createdAt").optional(),
    body("genres").notEmpty(),
    body("image").notEmpty().isString(),
    body("actors").notEmpty(),
    body("price").notEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: "fail",
                errors: errors.array().map((err) => ({
                    msg: err.msg,
                    field: err.path,
                })),
            });
        }
        next();
    },
];

/**
 * Get all movies
 * @async
 * @function getAllMovies
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @return {Promise<void>}
 */
exports.getAllMovies = async (request, response) => {
    try {
        const features = new ApiFeatures(moviesModel.find(), request.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        let movies = await features.query;

        response.status(200).json({
            status: "success",
            requestedAt: request.requestAt,
            count: movies.length,
            data: {
                movies: movies,
            },
        });
    } catch (error) {
        console.log(error);
        response.status(400).json({status: "fail", message: error.message});
    }
};

exports.addNewMovie = asyncErrorHandler(async (req, res) => {
    // try {
    const newMovie = await moviesModel.create({
        name: req.body.name,
        description: req.body.description,
        duration: req.body.duration,
        rating: req.body.rating,
        totalRatings: req.body.totalRatings,
        releaseYear: req.body.releaseYear,
        releaseDate: req.body.releaseDate,
        genres: req.body.genres,
        image: req.body.image,
        actors: req.body.actors,
        price: req.body.price,
    });

    res.status(201).json({
        status: "success",
        data: {
            movie: newMovie,
        },
    });
    // } catch (error) {
    // res.status(400).json({
    // status: "fail",
    // message: error.message,
    // });
    // }
});

/**
 * get movie by id
 * @async
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @return {Promise<void>}
 */
exports.getMovieById = async (request, response) => {
    try {
        const movie = await moviesModel.findById(request.params.id);
        response.status(200).json({
            status: "success",
            requestedAt: request.requestAt,
            data: {
                movie: movie,
            },
        });
    } catch (error) {
        response.status(404).json({
            status: "fail",
            message: error.message,
        });
    }
};

exports.updateMovieById = async (request, response) => {
    try {
        const updateMovie = await moviesModel.findByIdAndUpdate(
            request.params.id,
            request.body,
            {new: true, runValidators: true}
        );

        response.status(200).json({
            status: "success",
            requestedAt: request.requestAt,
            data: {
                movie: updateMovie,
            },
        });
    } catch (error) {
        response.status(404).json({
            status: "fail",
            requestedAt: request.requestAt,
            message: error.message,
        });
    }
};

/**
 * delete movie by id
 * @async
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @returns {Promise<void>}
 */
exports.deleteMovieById = async (request, response) => {
    try {
        const deleteMovie = await moviesModel.findByIdAndDelete(request.params.id);

        response.status(204).json({
            status: "success",
            requestedAt: request.requestAt,
            data: null,
        });
    } catch (error) {
        response.status(404).json({
            status: "fail",
            message: error.message,
        });
    }
};

/**
 * get movies stats
 * @async
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @returns {Promise<void>}
 */
exports.getMoviesStats = async (request, response) => {
    try {
        const stats = await moviesModel.aggregate([
            {$match: {rating: {$gte: 4.5}}},
        ]);

        response.status(200).json({
            status: "success",
            requestedAt: request.requestAt,
            count: stats.length,
            data: {
                stats: stats,
            },
        });
    } catch (error) {
        console.log(error);

        response.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};
