import { Request, Response } from "express";

export async function respond(req: Request, res: Response) {
  res.status(res.locals["status"] ?? 200).send({
    id: res.locals["id"],
    ...res.locals["data"],
  });
}
