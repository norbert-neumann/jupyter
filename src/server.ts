// import http from "node:http";

// // const server = http.createServer((req, res) => {
// //   req.
// //   res.writeHead(200, { "Content-Type": "text/plain" });
// //   res.end("Hello World!");
// // });

// // server.listen(3000, () => {
// //   console.log("Listening on 3000...");
// // });

// class Server {
//   constructor() {
//     this.routes = [];
//     this.methods = [];
//   }

//   listen(port) {
//     this.server = http.createServer((req, res) => this.handleRequest(req, res));
//     this.server.listen(port, console.log(`Listening on ${port}...`));
//   }

//   handleRequest(req, res) {
//     console.clear();
//     console.log("On handle request!");
//     console.log(req.url);

//     for (let index = 0; index < this.routes.length; index++) {
//       const route = this.routes[index];
//       if (req.method === this.methods[index] && this.match(req.url, route)) {
//         console.log(`Handled request with route ${this.methods[index]} - ${route}`);

//         res.writeHead(200, { "Content-Type": "text/plain" });
//         res.end("OK");
//         return;
//       }
//     }
//     console.log("No handler match!");
//   }

//   get(route) {
//     this.routes.push(route);
//     this.methods.push("GET");
//   }

//   match(url, route) {
//     if (route === "/") {
//       return true;
//     }

//     const urlParts = url.split("/").filter((part) => part !== "");
//     const routeParts = route.split("/").filter((part) => part !== "");

//     for (let index = 0; index < routeParts.length; index++) {
//       const element = routeParts[index];
//       if (!element.startsWith(":") && element !== urlParts[index]) {
//         return false;
//       }
//     }

//     return true;
//   }
// }

// export default Server;

export default function () {
  console.log("asd");
}
