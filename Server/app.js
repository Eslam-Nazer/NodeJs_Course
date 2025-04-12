const http = require("http");
/**
 * @description: this example to create a server using http module
 * @author Eslam
 * @date 2023-10-01
 */

const server = http.createServer((request, response) => {
  // console.log("Request received");
  // response.end("Hello from server");

  let url = request.url;

  if (url === "/" || url === "/home") {
    response.end("Home page");
  } else if (url === "/about") {
    response.end("About page");
  } else if (url === "/contact") {
    response.end("Contact page");
  } else {
    response.statusCode = 404;
    response.end("Page not found");
  }
});

server.listen(9000, "127.0.0.1", () => {
  console.log("Server running at http://127.0.0.1:9000/");
});
