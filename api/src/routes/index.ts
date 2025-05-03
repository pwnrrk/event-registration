import { Router } from "express";
import { getEmptySeats, getSeats } from "../repositories/seatRepository";

const indexRoute = Router();

indexRoute.get("/", async function (_, res) {
  res.json({
    name: "event-registration",
    version: "0.0.1",
    totalSeat: (await getSeats({})).length,
    available: (await getEmptySeats()).length,
  });
});

export default indexRoute;
