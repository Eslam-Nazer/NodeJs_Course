const app = require("./app");
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
  rating: Number,
});

const MovieModel = mongoose.model("MovieModel", movieSchema);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
