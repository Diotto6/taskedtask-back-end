"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginMiddleware = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
require("dotenv/config");
const constants_1 = require("../constants");
const repositories_1 = require("../database/repositories");
async function loginMiddleware(request, response, next) {
    const { email, password } = request.body.data || request.body;
    const service = new repositories_1.UserRepository();
    const users = await service.find(email);
    const user = users.find((user) => user.email === email);
    if (!email || !password) {
        return response.status(constants_1.HttpBadRequestCode).json({
            ok: false,
            message: "Preencha os campos obrigatórios!",
        });
    }
    if (user) {
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return response.status(constants_1.HttpBadRequestCode).json({ ok: false, message: "Email ou senha incorretos" });
        }
    }
    if (!user) {
        return response.status(constants_1.HttpBadRequestCode).json({ ok: false, message: "Email ou senha incorretos" });
    }
    next();
}
exports.loginMiddleware = loginMiddleware;
//# sourceMappingURL=login.js.map