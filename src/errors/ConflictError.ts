import { HttpError } from "@/errors/HttpError.js";

export class ConflictError extends HttpError {
  constructor(entity: string) {
    super(`${entity} already exists`, 409);
  }
}
