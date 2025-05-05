import { Router } from "express";
import * as SeatController from "../controllers/seatController";
import seatValidator from "../validators/seatValidator";
import { verifyAdmin } from "../middlewares/authMiddleware";

const seatRoute = Router();

seatRoute.get("/", SeatController.index);
seatRoute.post("/", seatValidator, verifyAdmin, SeatController.create);
seatRoute.put("/:seatId/user/:userId", verifyAdmin, SeatController.assignUser);
seatRoute.delete("/:seatId/user", verifyAdmin, SeatController.removeUser);

export default seatRoute;
