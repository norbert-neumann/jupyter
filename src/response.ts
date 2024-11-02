export enum ContentType {
  Text = 0,
  Html = 1,
  Json = 2,
}

export class ClientResponse {
  payload: string;
  contentType: ContentType;
  status: number;

  constructor(payload: string, contentType: ContentType, status: number) {
    this.payload = payload;
    this.contentType = contentType;
    this.status = status;
  }
}
