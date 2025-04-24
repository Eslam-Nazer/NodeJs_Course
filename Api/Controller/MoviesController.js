const fs = require("fs");
const { body, validationResult } = require("express-validator");
let movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));
/**
 * @type {import("mongoose").Model<import('./../Model/MovieModel')>}
 */
const moviesModel = require("./../Model/MovieModel");

// exports.checkId = (req, res, next, value) => {
//   console.log(`Id is ${value}`);

//   let movie = movies.find((el) => el.id === Number(value));
//   if (!movie) {
//     return res.status(404).json({
//       status: "fail",
//       message: `Movie with ID ${value} not found`,
//     });
//   }
//   req.movie = movie;
//   next();
// };

exports.validateMovies = [
  body("name").notEmpty().withMessage("Name is required"),
  body("duration").notEmpty().withMessage("Duration is required"),
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
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @return {Promise<void>}
 */
exports.getAllMovies = async (req, res) => {
  // res.status(200).json({
  //   status: "success",
  //   requestedAt: req.requestAt,
  //   count: movies.length,
  //   data: {
  //     movies: movies,
  //   },
  // });
  try {
    const movies = await moviesModel.find();

    res.status(200).json({
      status: "success",
      requestedAt: req.requestAt,
      count: movies.length,
      data: {
        movies: movies,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "fail", message: error.message });
  }
};

exports.addNewMovie = async (req, res) => {
  try {
    const newMovie = await moviesModel.create({
      name: req.body.name,
      description: req.body.description,
      duration: req.body.duration,
      rating: req.body.rating,
    });

    res.status(201).json({
      status: "success",
      data: {
        movie: newMovie,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

/**
 * get movie by id
 * @async
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @return {Promise<void>}
 */
exports.getMovieById = async (request, response) => {
  // response.status(200).json({
  //   status: "success",
  //   data: {
  //     movie: request.movie,
  //   },
  // });
  try {
    // const movie = await moviesModel.find({_id: request.params.id});
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
  // if (!request.body) {
  //   return response.status(400).json({
  //     status: "fail",
  //     message: "No data provided",
  //   });
  // }
  // const index = movies.indexOf(movie);
  // let movie = Object.assign(request.movie, request.body);
  // movies[index] = movie;
  // fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
  //   if (err) {
  //     return response.status(500).json({
  //       status: "fail",
  //       message: "Error writing to file",
  //     });
  //   }
  //   response.status(200).json({
  //     status: "success",
  //     data: {
  //       movie: movie,
  //     },
  //   });
  // });

  try {
    const updateMovie = await moviesModel.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true }
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
  // const index = movies.indexOf(request.movie);
  // movies.splice(index, 1);
  // fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
  //   if (err) {
  //     return response.status(500).json({
  //       status: "fail",
  //       message: "Error writing to file",
  //     });
  //   }
  //   response.status(204).json({
  //     status: "success",
  //     data: null,
  //   });
  // });
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
