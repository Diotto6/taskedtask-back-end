import { Response, Request } from "express";
import { HttpError } from "../errors";
import {
  createMessage,
  defaultErrorMessage,
  HttpBadRequestCode,
  httpCreatedCode,
  HttpInternalErrorCode,
  httpSucessCode,
  HttpUnauthorized,
} from "../constants";
import { ErrandEntity, UserEntity } from "../database/entities";
import { ErrandRepository } from "../database/repositories";

export default class ErrandController {
  async index(request: Request, response: Response) {
    const { userId } = request.params;

    try {
      const errands = await ErrandEntity.find({ where: { userId: userId } });
      const errand = errands.map((errand) => {
        return {
          id: errand.id,
          message: errand.message,
          userId: errand.userId,
        };
      });
      if (errand) {
        return response.status(httpSucessCode).json(
          { data: errand, ok: true }
        )
      } else {
        return response.status(HttpBadRequestCode).json(
          { data: [], ok: false }
        )
      }
    } catch (error) {
      throw new HttpError(defaultErrorMessage, HttpInternalErrorCode);
    }
  }

  async store(request: Request, response: Response) {
    const { userId } = request.params;
    const { message } = request.body || request.body.data;
    const service = new ErrandRepository();
    const user = await service.find(userId);
    const userAuth = user?.filter((user) => user.userId === userId);

    if (!user) {
      return response.status(HttpUnauthorized).json("Você não está autorizado!")
    }
    try {
      if (userAuth) {
        const messages = await service.create({
          message,
          userId,
        });
        return response.status(httpCreatedCode).json({
          ok: true,
          data: messages,
          message: createMessage("Recado criado"),
        })
      }
    } catch (error) {
      throw new HttpError(defaultErrorMessage, HttpInternalErrorCode);
    }
  }

  async update(request: Request, response: Response) {
    const { id, userId } = request.params;
    const { message } = request.body;
    const service = new ErrandRepository();
    const messageId = await service.findOne(id)
    try {
      if (messageId) {
        await service.update({
          id,
          message,
          userId,
        });
        return response.status(httpCreatedCode).json({
          ok: true,
          message: createMessage("Recado alterado"),
        });
      } else {
        return response.status(HttpBadRequestCode).json({
          ok: false,
          message: { message: "Recado não encontrado" },
        });
      }
    } catch (error) {
      throw new HttpError(defaultErrorMessage, HttpInternalErrorCode);
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const service = new ErrandRepository();
    const message = await service.findOne(id)
    try {
      if (message) {
        await service.delete(id);

        return response.status(httpSucessCode).json({
          ok: true,
          message: createMessage("Recado deletado"),
        });
      } else {
        return response.status(HttpBadRequestCode).json({
          ok: false,
          message: { message: "Recado não encontrado" },
        });
      }
    } catch (error) {
      throw new HttpError(defaultErrorMessage, HttpInternalErrorCode);
    }
  }
}
