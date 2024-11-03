import http from "node:http";
import { ClientRequest } from "./request.js";
import { ClientResponse, ContentType } from "./response.js";
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
  handlers: ((req: ClientRequest, res: ClientResponse) => void)[];
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | undefined;

  constructor() {
    this.routes = [];
    this.methods = [];
    this.handlers = [];
  }

  listen(port: number) {
    this.server = http.createServer((req, res) => this.handleRequest(req, res));
    this.server.listen(port, () => console.log(`Listening on ${port}...`));
  }

  async createExternalRequest(req: http.IncomingMessage, params: object): Promise<ClientRequest> {
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

    return new ClientRequest(
      body ? JSON.parse(body) : {},
      Object.fromEntries(new URL(req.url!, `http://${req.headers.host}`).searchParams),
      params,
    );
  }

  writeToInternalResponse(
    internalRes: http.ServerResponse<http.IncomingMessage>,
    externalRes: ClientResponse,
  ) {
    const contentType =
      externalRes.contentType === ContentType.Json
        ? "application/json"
        : externalRes.contentType === ContentType.Html
          ? "text/html"
          : "text/plain";

    internalRes.writeHead(externalRes.status!, { "Content-Type": contentType });
    internalRes.write(externalRes.payload);
  }

  async handleRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage },
  ) {
    for (let index = 0; index < this.routes.length; index++) {
      const route = this.routes[index];

      if (req.method === this.methods[index]) {
        const result = this.match(req.url!, route);
        if (result.match) {
          console.log(`Handled request with route ${this.methods[index]} - ${route}`);

          const externalReq = await this.createExternalRequest(req, result.params!);
          const externalRes = new ClientResponse();
          this.handlers[index](externalReq, externalRes);
          this.writeToInternalResponse(res, externalRes);
          res.end();
          return;
        }
      }
    }
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("NO HANDLER MATCH");
  }

  get(route: string, handler: (req: ClientRequest, res: ClientResponse) => void) {
    this.methods.push("GET");
    this.routes.push(route);
    this.handlers.push(handler);
  }

  post(route: string, handler: (req: ClientRequest, res: ClientResponse) => void) {
    this.methods.push("POST");
    this.routes.push(route);
    this.handlers.push(handler);
  }

  put(route: string, handler: (req: ClientRequest, res: ClientResponse) => void) {
    this.methods.push("PUT");
    this.routes.push(route);
    this.handlers.push(handler);
  }

  patch(route: string, handler: (req: ClientRequest, res: ClientResponse) => void) {
    this.methods.push("PATCH");
    this.routes.push(route);
    this.handlers.push(handler);
  }

  delete(route: string, handler: (req: ClientRequest, res: ClientResponse) => void) {
    this.methods.push("DELETE");
    this.routes.push(route);
    this.handlers.push(handler);
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
