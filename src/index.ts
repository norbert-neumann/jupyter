import { ClientRequest } from "./request.js";
import { ClientResponse, ContentType } from "./response.js";
import Server from "./server.js";

const server = new Server();

server.listen(3001);
server.get("/api", (req: ClientRequest) => {
  return new ClientResponse("OKE", ContentType.Text, 200);
});
