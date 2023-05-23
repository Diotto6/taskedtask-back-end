"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const constants_1 = require("../constants");
const entities_1 = require("../database/entities");
const repositories_1 = require("../database/repositories");
class UserController {
    async index(request, response) {
        const { id } = request.params;
        const service = await entities_1.UserEntity.find({ where: { id: id } });
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
            }
            else {
                return response.json({
                    ok: false,
                    message: "Erro ao buscar dados do usuario",
                    data: {}
                });
            }
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpInternalErrorCode);
        }
    }
    async store(request, response) {
        const { firstName, lastName, email, password, passwordConfirm } = request.body.data;
        const service = new repositories_1.UserRepository();
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
                .status(constants_1.httpCreatedCode);
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpInternalErrorCode);
        }
    }
    async authenticate(request, response) {
        const { email } = request.body.data;
        const service = await entities_1.UserEntity.find({ where: { email: email } });
        const user = service.find((user) => user.email === email);
        try {
            const token = jsonwebtoken_1.default.sign({ id: user?.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
            return response.json({
                ok: true,
                email,
                message: "Logado com sucesso!",
                token,
                data: { user }
            });
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpInternalErrorCode);
        }
    }
}
exports.default = UserController;
//# sourceMappingURL=user.js.map