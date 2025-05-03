import { Router } from "express";
import * as UserController from "../controllers/userController";
import userValidator from "../validators/userValidator";

const userRoute = Router();

userRoute.get("/", UserController.index);
userRoute.post("/", userValidator, UserController.create);

export default userRoute;
