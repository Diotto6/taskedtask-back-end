import { Request, Response } from "express";
import { HttpError } from "../errors";
import jwt from "jsonwebtoken";
import "dotenv/config";
import {
  defaultErrorMessage,
  HttpBadRequestCode,
  httpCreatedCode,
  HttpInternalErrorCode,
  httpSucessCode,
} from "../constants";
import { UserEntity } from "../database/entities";
import { UserRepository } from "../database/repositories";
import { v4 as uuidV4 } from 'uuid'

export default class UserController {
  async index(request: Request, response: Response) {
    const { id } = request.params
    const service = await UserEntity.find({ where: { id: id } });
    const user = service.find((user) => user.id === id);
    try {
      if (user) {
        return response.status(httpSucessCode).json({
          ok: true,
          message: "Dados do usuário buscado com sucesso",
          data: {
            user,
          }
        });
      } else {
        return response.status(HttpBadRequestCode).json({
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
      request.body.data || request.body;

    const service = new UserRepository();

    try {
      const user = await service.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
      });

      return response.status(httpCreatedCode).json({
        ok: true,
        message: "Conta cadastrada com sucesso",
        data: { user }
      })

    } catch (error) {
      throw new HttpError(defaultErrorMessage, HttpInternalErrorCode);
    }
  }

  async authenticate(request: Request, response: Response) {
    const { email } = request.body.data || request.body;
    const service = await UserEntity.find({ where: { email: email } });
    const user = service.find((user) => user.email === email);

    try {
      const token = jwt.sign(
        { id: user?.id },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_EXPIRES }
      );

      return response.status(httpSucessCode).json({
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
