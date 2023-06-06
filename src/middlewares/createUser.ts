import { Request, Response, NextFunction } from "express";
import { HttpBadRequestCode } from "../constants";
import { UserRepository } from "../database/repositories";

export async function checkRegistration(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { email } = request.body.data || request.body;

  const service = new UserRepository();
  const users = await service.find(email);
  const userCreate = users.find((user) => user.email === email);

  if (userCreate) {
    return response.status(HttpBadRequestCode).json({
      ok: false,
      message: "Email ja está cadastrado!",
    })
  }

  next();
}
