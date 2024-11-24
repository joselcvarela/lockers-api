export class HttpError extends Error {
  body: { message: string; type: string };

  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.body = {
      message,
      type: this.constructor.name,
    };
  }
}
