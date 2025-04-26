const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

mongoose
  .connect(process.env.MONGO_URL)
  .then((conn) => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error while connecting to MongoDB", error);
  });

const movieSchema = mongoose.Schema(
  {
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
    createdBy: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

movieSchema.virtual("durationInHours").get(function () {
  return this.duration / 60;
});

movieSchema.pre("save", function (next) {
  this.createdBy = "Eslam";
  next();
});

movieSchema.post("save", function (doc, next) {
  const content = `A new movie created with name ${doc.name} and created by ${doc.createdBy}\n`;
  if (!fs.existsSync("./Log")) {
    fs.mkdirSync("./Log");
  }
  try {
    fs.writeFileSync(path.join("Log", "log.txt"), content, { flag: "a" });
    next();
  } catch (error) {
    console.log(error.message);
  }
  next();
});

movieSchema.pre("find", function (next) {
  this.find().select("name price duration");
  next();
});

const MovieModel = mongoose.model("MovieModel", movieSchema);

module.exports = MovieModel;
