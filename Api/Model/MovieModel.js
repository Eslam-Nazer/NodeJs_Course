const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL)
  .then((conn) => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error while connecting to MongoDB", error);
  });

const movieSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, "Duration is required"],
  },
  rating: {
    type: Number,
    default: 1.0,
  },
  totalRatings: {
    type: Number,
  },
  releaseYear: {
    type: Number,
    required: [true, "Release Year is required"],
  },
  releaseDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  genres: {
    type: [String],
    required: [true, "Genres is required"],
  },
  image: {
    type: String,
    required: [true, "image is required"],
  },
  actors: {
    type: [String],
    required: [true, "Actors is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
});

const MovieModel = mongoose.model("MovieModel", movieSchema);

module.exports = MovieModel;
