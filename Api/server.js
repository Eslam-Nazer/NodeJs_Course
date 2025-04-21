const app = require("./app");

// const testMovie = new MovieModel({
//   name: "Test Movie",
//   description: "This is a test movie",
//   duration: 120,
//   rating: 5,
// });

// testMovie
//   .save()
//   .then((test) => {
//     console.log(test);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
