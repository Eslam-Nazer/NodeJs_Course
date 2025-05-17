const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const app = express();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const sanitizer = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const port = 4000;

let limiter = rateLimit({
    max: 1000,
    windowMs: 1000 * 60 * 60,
    message: "We have received too many requests from this ip, try again later.",
});

app.use('/api', limiter);
app.use(helmet());
app.use(sanitizer());
app.use(xss());
app.use(hpp());

const logger = (req, res, next) => {
    console.log(`this is middleware: ${req.method} ${req.url}`);
    next();
};

app.use(express.json({
    limit: "50kb",
}));
dotenv.config({path: "./config.env"});
app.use(express.urlencoded({extended: true}));
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
const authRouter = require("./Routes/authRouter");
const userRouter = require("./Routes/UserRoutes");
const CustomErrors = require("./Utils/CustomErrors");
app.use("/api/movies", moviesRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.all(/[\s\S]*.*[\s\S]*/gm, (request, response, next) => {
    // response.status(404).json({
    //   status: "fail",
    //   message: `Route ${request.originalUrl} not found`,
    // });
    const error = new CustomErrors(`Route ${request.originalUrl} not found`, 404);

    next(error);
});

app.use((error, request, response, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    response.status(error.statusCode).json({
        status: error.status,
        statusCode: error.statusCode,
        message: `error: ${error.message}`,
    });
});

module.exports = app;
