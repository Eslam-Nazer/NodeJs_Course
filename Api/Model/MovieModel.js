const mongoose = require("mongoose");

// console.log(process.env.PORT);
mongoose
  .connect(process.env.MONGO_URL)
  .then((conn) => {
    // console.log(conn);
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
  },
  description: String,
  duration: {
    type: Number,
    required: [true, "Duration is required"],
  },
  rating: {
    type: Number,
    default: 1.0,
  },
});

const MovieModel = mongoose.model("MovieModel", movieSchema);

module.exports = MovieModel;
