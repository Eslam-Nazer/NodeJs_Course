const http = require("http");
const fs = require("fs");
const path = require("path");
const { title } = require("process");

const server = http.createServer(function (request, response) {
  console.log("Request received");
  const html = fs.readFileSync(
    path.join(__dirname, "template", "index.html"),
    "utf-8"
  );

  if (request.url == "/" || request.url == "/home") {
    // response.end("Welcome to the home page");
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(
      html
        .replace("{{title}}", "Home Page")
        .replace("{{%CONTENT%}}", "Welcome to the home page")
    );
  } else if (request.url == "/about") {
    response.writeHead(200, { "Content-Type": "text/html" });
    // response.end("Welcome to the about page");
    response.end(
      html
        .replace("{{title}}", "About Page")
        .replace("{{%CONTENT%}}", "Welcome to the about page")
    );
  } else if (request.url == "/product") {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(
      html
        .replace("{{title}}", "Product Page")
        .replace("{{%CONTENT%}}", "Welcome to the product page")
    );
  } else if (request.url == "/contact") {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(
      html
        .replace("{{title}}", "Contact Page")
        .replace("{{%CONTENT%}}", "Welcome to the contact page")
    );
  } else {
    response.writeHead(404, { "Content-Type": "text/html" });
    response.end(
      html
        .replace("{{title}}", "404 Page")
        .replace("{{%CONTENT%}}", "Error: 404 Page not found")
    );
  }
});

server.listen(3000, function () {
  console.log("Server is listening on port 3000");
  console.log("http://localhost:3000");
  console.log("Press Ctrl+C to stop the server");
  console.log("-------------------------------------");
});
