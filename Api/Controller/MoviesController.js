const fs = require("fs");
const { body, validationResult } = require("express-validator");
let movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));

exports.checkId = (req, res, next, value) => {
  console.log(`Id is ${value}`);

  let movie = movies.find((el) => el.id === Number(value));
  if (!movie) {
    return res.status(404).json({
      status: "fail",
      message: `Movie with ID ${value} not found`,
    });
  }
  req.movie = movie;
  next();
};

exports.validateMovies = [
  body("name").notEmpty().withMessage("Name is required"),
  body("description").notEmpty().withMessage("Description is required"),
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
// exports.validateBody = (req, res, next) => {
// if (!req.body.name || !req.body.description || !req.body.duration) {
//   return res.status(400).json({
//     status: "fail",
//     message: `Invalid body data`,
//   });
// }
//   body('name').notE

//   next();
// };

exports.getAllMovies = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestAt,
    count: movies.length,
    data: {
      movies: movies,
    },
  });
};

exports.addNewMovie = (req, res) => {
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

exports.getMovieById = (request, response) => {
  // const id = request.params.id;

  // let movie = movies.find((el) => el.id === Number(id));

  // if (!movie) {
  //   return response.status(404).json({
  //     status: "fail",
  //     message: "Movie not found",
  //   });
  // }

  response.status(200).json({
    status: "success",
    data: {
      movie: request.movie,
    },
  });
};

exports.updateMovieById = (request, response) => {
  if (!request.body) {
    return response.status(400).json({
      status: "fail",
      message: "No data provided",
    });
  }

  // const id = request.params.id;

  // let movie = movies.find((el) => el.id === Number(id));

  // if (!movie) {
  //   return response.status(404).json({
  //     status: "fail",
  //     message: "Movie not found",
  //   });
  // }

  const index = movies.indexOf(movie);

  let movie = Object.assign(request.movie, request.body);
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

exports.deleteMovieById = (request, response) => {
  // if (!request.params) {
  //   response.status(400).json({
  //     status: "fail",
  //     message: "No data provided",
  //   });
  // }

  // const id = request.params.id;

  // let movie = movies.find((el) => el.id === Number(id));

  // if (!movie) {
  //   return response.status(404).json({
  //     status: "fail",
  //     message: "Movie not found",
  //   });
  // }

  const index = movies.indexOf(request.movie);

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
