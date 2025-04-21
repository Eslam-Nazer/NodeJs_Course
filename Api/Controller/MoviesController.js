const fs = require("fs");
let movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));

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

exports.updateMovieById = (request, response) => {
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

exports.deleteMovieById = (request, response) => {
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
