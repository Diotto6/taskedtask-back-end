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
            if (errand)
                return response
                    .json({ data: errand, ok: true })
                    .status(201);
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpInternalErrorCode);
        }
    }
    async store(request, response) {
        const { userId } = request.params;
        const { message } = request.body;
        const service = new repositories_1.ErrandRepository();
        const user = await service.find(userId);
        const userAuth = user?.filter((user) => user.userId === userId);
        if (!user) {
            return response.json("Você não está autorizado!").status(400);
        }
        try {
            if (userAuth) {
                const messages = await service.create({
                    message,
                    userId,
                });
                return response
                    .json({
                    ok: true,
                    data: messages,
                    message: (0, constants_1.createMessage)("Recado criado"),
                })
                    .status(constants_1.httpCreatedCode);
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
        try {
            await service.update({
                id,
                message,
                userId,
            });
            return response
                .json({
                ok: true,
                message: (0, constants_1.createMessage)("Recado alterado"),
            })
                .status(constants_1.httpCreatedCode);
        }
        catch (error) {
            console.error(error);
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpInternalErrorCode);
        }
    }
    async delete(request, response) {
        const { id } = request.params;
        const service = new repositories_1.ErrandRepository();
        try {
            await service.delete(id);
            return response
                .json({
                ok: true,
                message: (0, constants_1.createMessage)("Recado deletado"),
            })
                .status(constants_1.httpSucessCode);
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpInternalErrorCode);
        }
    }
}
exports.default = ErrandController;
//# sourceMappingURL=errands.js.map