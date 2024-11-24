import { HttpError } from "@/errors/HttpError.js";

export class NoFreeLockersError extends HttpError {
  constructor() {
    super(`No free locks at the moment. Try later.`, 409);
  }
}
