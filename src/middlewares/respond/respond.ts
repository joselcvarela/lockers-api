import { Request, Response } from "express";

export async function respond(req: Request, res: Response) {
  const body = Object.assign(
    {},
    res.locals["id"] ? { id: res.locals["id"] } : {},
    res.locals["data"],
  );

  res.status(res.locals["status"] ?? 200).send(body);
}
