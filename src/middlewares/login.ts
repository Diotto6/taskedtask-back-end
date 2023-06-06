import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import "dotenv/config";

import { HttpBadRequestCode } from "../constants";
import { NextFunction } from "express";
import { UserRepository } from "../database/repositories";

export async function loginMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { email, password } = request.body.data || request.body;
  const service = new UserRepository();
  const users = await service.find(email);
  const user = users.find((user) => user.email === email);

  if (!email || !password) {
    return response.status(HttpBadRequestCode).json({
      ok: false,
      message: "Preencha os campos obrigatórios!",
    })
  }
  if (user) {
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return response.status(HttpBadRequestCode).json({ ok: false, message: "Email ou senha incorretos" })
    }
  }

  if (!user) {
    return response.status(HttpBadRequestCode).json({ ok: false, message: "Email ou senha incorretos" })
  }

  next();
}
