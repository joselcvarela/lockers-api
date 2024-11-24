import { HttpError } from "@/errors/HttpError.js";

export class ValidationError extends HttpError {
  constructor(field: string, expected: string) {
    super(`Expected field "${field}" to be "${expected}"`, 400);
  }
}
