const http = require("http");
/**
 * @description: this example to create a server using http module
 * @author Eslam
 * @date 2023-10-01
 */

const server = http.createServer((request, response) => {
  console.log("Request received");
  response.end("Hello from server");
});

server.listen(9000, "127.0.0.1", () => {
  console.log("Server running at http://127.0.0.1:9000/");
});
