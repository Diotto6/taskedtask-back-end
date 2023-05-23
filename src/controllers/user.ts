import { Request, Response } from "express";
import { HttpError } from "../errors";
import jwt from "jsonwebtoken";
import "dotenv/config";

import {
  defaultErrorMessage,
  httpCreatedCode,
  HttpInternalErrorCode,
} from "../constants";
import { UserEntity } from "../database/entities";
import { UserRepository } from "../database/repositories";

export default class UserController {
  async index(request: Request, response: Response) {
    const { id } = request.params
    const service = await UserEntity.find({ where: { id: id } });
    const user = service.find((user) => user.id === id);

    try {
      if (user) {
        return response.json({
          ok: true,
          message: "",
          data: {
            user,
          }
        });
      } else {
        return response.json({
          ok: false,
          message: "Erro ao buscar dados do usuario",
          data: {}
        });
      }

    } catch (error) {
      throw new HttpError(defaultErrorMessage, HttpInternalErrorCode);
    }
  }

  async store(request: Request, response: Response) {
    const { firstName, lastName, email, password, passwordConfirm } =
      request.body.data;

    const service = new UserRepository();

    try {
      const user = await service.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
      });

      return response
        .json({
          ok: true,
          message: "Conta cadastrada com sucesso",
          data: { user }
        })
        .status(httpCreatedCode);
    } catch (error) {
      throw new HttpError(defaultErrorMessage, HttpInternalErrorCode);
    }
  }

  async authenticate(request: Request, response: Response) {
    const { email } = request.body.data;
    const service = await UserEntity.find({ where: { email: email } });
    const user = service.find((user) => user.email === email);

    try {
      const token = jwt.sign(
        { id: user?.id },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_EXPIRES }
      );

      return response.json({
        ok: true,
        email,
        message: "Logado com sucesso!",
        token,
        data: { user }
      });
    } catch (error) {
      throw new HttpError(defaultErrorMessage, HttpInternalErrorCode);
    }
  }
}
