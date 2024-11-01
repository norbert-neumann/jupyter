import Server from "./server.js";

const server = new Server();

server.listen(3001);
server.get("/api/a/b/:p1");
