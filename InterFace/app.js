const readline = require("readline");
/**
 * @description This code creates a readline interface that allows the user to input their name and then prints it to the console.
 * @author Eslam
 * @date 2023-10-07
 * Lecture 4
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("enter your name: ", (name) => {
  console.log("your name: " + name);
  rl.close();
});

rl.on("close", () => {
  console.log("Interface closed");
  process.exit(0);
});
