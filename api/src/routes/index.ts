import { Router } from "express";
import * as IndexController from "../controllers/indexController";

const indexRoute = Router();

indexRoute.get("/", IndexController.getInformation);

export default indexRoute;
