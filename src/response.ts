export enum ContentType {
  Text = 0,
  Html = 1,
  Json = 2,
}

export class ClientResponse {
  payload: string | undefined;
  contentType: ContentType | undefined;
  status: number | undefined;
}
