export class ClientRequest {
  body: object;
  query: object;
  params: { [key: string]: any };

  constructor(body: object, query: object, params: object) {
    this.body = body;
    this.query = query;
    this.params = params;
  }
}
