import { Router } from "express";
import UserController from "../controllers/user";
import MensagensController from "../controllers/errands";
import { authMiddleware, checkRegistration } from "../middlewares";
import { loginMiddleware } from "../middlewares/login";

export default class NewRoutes {
  init() {
    const router = Router();
    const userController = new UserController();
    const errandsController = new MensagensController();

    router.post("/auth", loginMiddleware, userController.authenticate);
    router.post("/user", checkRegistration, userController.store);
    router.get("/user/:id", authMiddleware, userController.index);

    router.use(authMiddleware)
    router.get("/messages/:userId", errandsController.index);
    router.post("/messages/:userId", errandsController.store);
    router.put("/messages/:userId/:id", errandsController.update);
    router.delete("/messages/:id", errandsController.delete);

    return router;
  }
}
