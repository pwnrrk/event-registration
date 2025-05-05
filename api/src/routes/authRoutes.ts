import { Router } from "express";
import * as AuthController from "../controllers/authContoller";
import { verifyAdmin } from "../middlewares/authMiddleware";

const authRoute = Router();

authRoute.post("/", AuthController.login);
authRoute.get("/", verifyAdmin, AuthController.getCurrent);
authRoute.delete("/", verifyAdmin, AuthController.logout);

export default authRoute;
