import http from "node:http";
import { parse } from "url";
import { ClientRequest } from "./request.js";
// url = require("url")
// url.parse

// const server = http.createServer((req, res) => {
//   req.
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end("Hello World!");
// });

// server.listen(3000, () => {
//   console.log("Listening on 3000...");
// });

class Server {
  routes: string[];
  methods: string[];
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | undefined;

  constructor() {
    this.routes = [];
    this.methods = [];
  }

  listen(port: number) {
    this.server = http.createServer((req, res) => this.handleRequest(req, res));
    this.server.listen(port, () => console.log(`Listening on ${port}...`));
  }

  async processRequest(req: http.IncomingMessage, params: object): Promise<ClientRequest> {
    let body = "";

    // Use a promise to handle asynchronous data collection
    await new Promise<void>((resolve) => {
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        resolve();
      });
    });

    // Create and return the ClientRequest instance once the body is ready
    return new ClientRequest(
      body ? JSON.parse(body) : {},
      Object.fromEntries(new URL(req.url!, `http://${req.headers.host}`).searchParams),
      params,
    );
  }

  handleRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage },
  ) {
    for (let index = 0; index < this.routes.length; index++) {
      const route = this.routes[index];

      if (req.method === this.methods[index]) {
        const result = this.match(req.url!, route);
        if (result.match) {
          console.log(`Handled request with route ${this.methods[index]} - ${route}`);

          this.processRequest(req, result.params!).then((result) => console.log(result.params));
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("OK");
          return;
        }
      }
    }
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("NO HANDLER MATCH");
  }

  get(route: string) {
    this.methods.push("GET");
    this.routes.push(route);
  }

  post(route: string) {
    this.methods.push("POST");
    this.routes.push(route);
  }

  put(route: string) {
    this.methods.push("PUT");
    this.routes.push(route);
  }

  patch(route: string) {
    this.methods.push("PATCH");
    this.routes.push(route);
  }

  delete(route: string) {
    this.methods.push("DELETE");
    this.routes.push(route);
  }

  match(url: string, route: string) {
    if (route === "/") {
      return { match: true, params: {} };
    }

    const urlParts = url.split("/").filter((part) => part !== "");
    const routeParts = route.split("/").filter((part) => part !== "");

    console.log(url.split("/").length);
    console.log(route.split("/").length);

    if (url.split("/").length !== route.split("/").length) {
      return { match: false, params: null };
    }

    const params: { [key: string]: any } = {};

    for (let index = 0; index < routeParts.length; index++) {
      const element = routeParts[index];

      if (index === routeParts.length - 1) {
        urlParts[index] = urlParts[index].split("?")[0];
      }

      if (element.startsWith(":")) {
        params[element.replace(":", "")] = urlParts[index];
      }

      if (!element.startsWith(":") && element !== urlParts[index]) {
        console.log(element);
        console.log(urlParts[index]);
        return { match: false, params: {} };
      }
    }

    return { match: true, params };
  }
}

export default Server;
