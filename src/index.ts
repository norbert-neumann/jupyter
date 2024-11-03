import { ClientRequest } from "./request.js";
import { ClientResponse, ContentType } from "./response.js";
import Server from "./server.js";

const server = new Server();

server.listen(3001);
server.get("/api/:p", (req: ClientRequest, res: ClientResponse) => {
  if (req.params.p === "asd") {
    res.payload = "Oke - asd";
  } else {
    res.payload = "Oke - no asd";
  }

  res.contentType = ContentType.Text;
  res.status = 200;
});
