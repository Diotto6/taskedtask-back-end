"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const constants_1 = require("../constants");
const entities_1 = require("../database/entities");
const repositories_1 = require("../database/repositories");
class ErrandController {
    async index(request, response) {
        const { userId } = request.params;
        try {
            const errands = await entities_1.ErrandEntity.find({ where: { userId: userId } });
            const errand = errands.map((errand) => {
                return {
                    id: errand.id,
                    message: errand.message,
                    userId: errand.userId,
                };
            });
            if (errand) {
                return response.status(constants_1.httpSucessCode).json({ data: errand, ok: true });
            }
            else {
                return response.status(constants_1.HttpBadRequestCode).json({ data: [], ok: false });
            }
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpInternalErrorCode);
        }
    }
    async store(request, response) {
        const { userId } = request.params;
        const { message } = request.body || request.body.data;
        const service = new repositories_1.ErrandRepository();
        const user = await service.find(userId);
        const userAuth = user?.filter((user) => user.userId === userId);
        if (!user) {
            return response.status(constants_1.HttpUnauthorized).json("Você não está autorizado!");
        }
        try {
            if (userAuth) {
                const messages = await service.create({
                    message,
                    userId,
                });
                return response.status(constants_1.httpCreatedCode).json({
                    ok: true,
                    data: messages,
                    message: (0, constants_1.createMessage)("Recado criado"),
                });
            }
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpInternalErrorCode);
        }
    }
    async update(request, response) {
        const { id, userId } = request.params;
        const { message } = request.body;
        const service = new repositories_1.ErrandRepository();
        const messageId = await service.findOne(id);
        try {
            if (messageId) {
                await service.update({
                    id,
                    message,
                    userId,
                });
                return response.status(constants_1.httpCreatedCode).json({
                    ok: true,
                    message: (0, constants_1.createMessage)("Recado alterado"),
                });
            }
            else {
                return response.status(constants_1.HttpBadRequestCode).json({
                    ok: false,
                    message: { message: "Recado não encontrado" },
                });
            }
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpInternalErrorCode);
        }
    }
    async delete(request, response) {
        const { id } = request.params;
        const service = new repositories_1.ErrandRepository();
        const message = await service.findOne(id);
        try {
            if (message) {
                await service.delete(id);
                return response.status(constants_1.httpSucessCode).json({
                    ok: true,
                    message: (0, constants_1.createMessage)("Recado deletado"),
                });
            }
            else {
                return response.status(constants_1.HttpBadRequestCode).json({
                    ok: false,
                    message: { message: "Recado não encontrado" },
                });
            }
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpInternalErrorCode);
        }
    }
}
exports.default = ErrandController;
//# sourceMappingURL=errands.js.map