import { Router } from "express";
import * as SeatController from "../controllers/seatController";
import seatValidator from "../validators/seatValidator";

const seatRoute = Router();

seatRoute.get("/", SeatController.index);
seatRoute.post("/", seatValidator, SeatController.create);
seatRoute.put("/:seatId/user/:userId", SeatController.assignUser);

export default seatRoute;
