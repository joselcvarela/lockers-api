import { HttpError } from "@/errors/HttpError.js";

export class NotFoundError extends HttpError {
  constructor(entity: string, resource: string) {
    super(`${entity} not found: "${resource}"`, 404);
  }
}
