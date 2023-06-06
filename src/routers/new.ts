import { Router } from "express";
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'
import swaggerDocs from '../swagger.json'
import UserController from "../controllers/user";
import MensagensController from "../controllers/errands";
import { authMiddleware, checkRegistration } from "../middlewares";
import { loginMiddleware } from "../middlewares/login";

export default class NewRoutes {
  init() {
    const router = Router();
    const userController = new UserController();
    const errandsController = new MensagensController();

    router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
    
    router.post("/auth", loginMiddleware, userController.authenticate);
    router.post("/user", checkRegistration, userController.store);
    router.get("/user/:id", authMiddleware, userController.index);

    router.get("/messages/:userId", authMiddleware, errandsController.index);
    router.post("/messages/:userId", authMiddleware, errandsController.store);
    router.put("/messages/:userId/:id", authMiddleware, errandsController.update);
    router.delete("/messages/:id", authMiddleware, errandsController.delete);

    return router;
  }
}
