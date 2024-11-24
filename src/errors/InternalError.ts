import { HttpError } from "@/errors/HttpError.js";

export class InternalError extends HttpError {
  constructor() {
    super("Something went wrong", 500);
  }
}
